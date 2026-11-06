import { useEffect, useId, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import {
  applyPatch,
  type DashboardDefinition,
  editSnapshots,
  panels,
  references,
  singlePanel,
} from "@/lib/assistant/canvas";
import { dashboardFilters } from "@/lib/assistant/capabilities";
import type { ProviderId } from "@/lib/assistant/config";
import { type DataResultMap, dataResultMapSchema } from "@/lib/assistant/data-contract";
import { serializeTree, validateTree } from "@/lib/assistant/language";
import { bytes, type SafeNode } from "@/lib/assistant/registry";
import { consumeStream, StreamFailure } from "@/lib/assistant/transport";

import { failureCode, failureCopy, responseFailure, retryDeadline } from "./conversation";
import { AssistantDataProvider, TreeResponse } from "./registry";

export type CanvasActions = {
  provider?: ProviderId;
  blocked: boolean;
  sessionLost: () => void;
  busy: (value: boolean) => void;
  rate: (deadline: number) => void;
};
export function DashboardCanvas({
  tree,
  results,
  actions,
}: {
  tree: SafeNode;
  results: DataResultMap;
  actions: CanvasActions;
}) {
  const [view, setView] = useState<{ definition: DashboardDefinition; snapshots: DataResultMap }>(() => ({
    definition: { version: 1, revision: 0, tree },
    snapshots: results,
  }));
  const current = useRef(view);
  current.current = view;
  const [pending, setPending] = useState(false);
  const [stale, setStale] = useState(false);
  const [notice, setNotice] = useState("");
  const [target, setTarget] = useState("");
  const [prompt, setPrompt] = useState("");
  const active = useRef<AbortController | null>(null);
  const generation = useRef(0);
  const id = useId();
  const editor = useRef<HTMLTextAreaElement>(null);
  const callback = useRef(actions);
  callback.current = actions;
  useEffect(
    () => () => {
      generation.current++;
      active.current?.abort();
      callback.current.busy(false);
    },
    [],
  );
  function stop() {
    generation.current++;
    active.current?.abort();
    active.current = null;
    setPending(false);
    actions.busy(false);
    setNotice("Stopped. The dashboard is unchanged.");
    editor.current?.focus();
  }
  async function run(refresh: boolean) {
    if (active.current || actions.blocked) return;
    if (!refresh && (!target || !prompt.trim())) {
      setNotice("Choose a panel or Add panel, then describe the edit.");
      return;
    }
    const before = current.current;
    const revision = before.definition.revision;
    const op = target === "add" ? "add" : "replace";
    const ids = new Set(panels(before.definition.tree).map((p) => p.props.id));
    let targetId = target;
    if (op === "add") {
      let n = 1;
      while (ids.has(`panel-${n}`)) n++;
      targetId = `panel-${n}`;
    }
    const body = JSON.stringify(
      refresh
        ? { refs: references(before.definition.tree) }
        : {
            operation: "edit",
            provider: actions.provider,
            messages: [{ role: "user", content: prompt }],
            edit: { definition: serializeTree(before.definition.tree), baseRevision: revision, op, targetId },
          },
    );
    if (bytes(body) > 65536 || (!refresh && bytes(prompt) > 8192)) {
      setNotice("This edit is too large. Shorten the instruction or create a smaller dashboard.");
      return;
    }
    const token = ++generation.current;
    const controller = new AbortController();
    active.current = controller;
    setPending(true);
    actions.busy(true);
    setNotice(refresh ? "Refreshing data…" : "Preparing panel edit…");
    const valid = () =>
      generation.current === token && current.current.definition.revision === revision && !controller.signal.aborted;
    try {
      const response = await fetch(refresh ? "/api/assistant-refresh" : "/api/assistant", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body,
        signal: controller.signal,
      });
      if (!valid()) {
        await response.body?.cancel();
        return;
      }
      if (response.status === 401) {
        await response.body?.cancel();
        actions.sessionLost();
        return;
      }
      if (!response.ok) {
        if (response.status === 429) actions.rate(retryDeadline(response.headers.get("Retry-After")));
        throw new StreamFailure(await responseFailure(response));
      }
      if (refresh) {
        if (!response.body) throw new StreamFailure("invalid");
        const reader = response.body.getReader();
        let size = 0;
        const chunks: Uint8Array[] = [];
        try {
          for (;;) {
            const part = await reader.read();
            if (part.done) break;
            size += part.value.byteLength;
            if (size > 32768) throw new StreamFailure("limit");
            chunks.push(part.value);
          }
        } finally {
          await reader.cancel();
          reader.releaseLock();
        }
        const payload = JSON.parse(await new Blob(chunks as BlobPart[]).text());
        if (payload.v !== 2 || Object.keys(payload).sort().join() !== "results,v") throw new StreamFailure("invalid");
        const snapshots = dataResultMapSchema.parse(payload.results);
        validateTree(before.definition.tree, snapshots);
        if (!valid()) return;
        setView({ ...before, snapshots });
        setStale(false);
        setNotice("Data refreshed. Layout unchanged.");
      } else {
        if (!response.body) throw new StreamFailure("invalid");
        let fresh: DataResultMap = {};
        const source = await consumeStream(
          response.body,
          controller.signal,
          () => {
            /* Edits are committed only after the terminal event. */
          },
          (data) => {
            fresh = data;
          },
        );
        const definition = applyPatch(before.definition, {
          version: 1,
          baseRevision: revision,
          op,
          targetId,
          panel: singlePanel(source, new Set([...Object.keys(before.snapshots), ...Object.keys(fresh)])),
        });
        const snapshots = editSnapshots(definition.tree, before.snapshots, fresh);
        if (!valid()) return;
        setView({ definition, snapshots });
        setPrompt("");
        setTarget(targetId);
        setNotice("Panel updated. Other panels are unchanged.");
      }
    } catch (error) {
      if (!valid()) return;
      if (refresh) setStale(true);
      setNotice(failureCopy[failureCode(error instanceof StreamFailure ? error.code : "invalid")]);
    } finally {
      if (generation.current === token) {
        active.current = null;
        setPending(false);
        actions.busy(false);
      }
    }
  }
  return (
    <section
      aria-label="Dashboard canvas"
      className="min-w-0 space-y-4"
      data-canvas-revision={view.definition.revision}
    >
      <div className="flex flex-wrap items-center gap-3">
        <h3 className="text-base font-medium">Dashboard</h3>
        <span className="text-muted-foreground text-sm">
          Range: {dashboardFilters.range[0] === "available" ? "Available" : ""} · Segment:{" "}
          {dashboardFilters.segment[0] === "all" ? "All" : ""}
        </span>
        <Button
          variant="outline"
          disabled={actions.blocked || pending || !references(view.definition.tree).length}
          onClick={() => void run(true)}
        >
          Refresh data
        </Button>
        {pending && (
          <Button variant="outline" onClick={stop}>
            Stop dashboard update
          </Button>
        )}
      </div>
      {stale && (
        <p role="alert" className="text-warning">
          Data may be stale. Refresh failed; previous values remain visible.
        </p>
      )}
      <p role="status" className="text-muted-foreground">
        {notice}
      </p>
      <AssistantDataProvider results={view.snapshots}>
        <TreeResponse tree={view.definition.tree} />
      </AssistantDataProvider>
      <form
        className="space-y-3"
        onSubmit={(event) => {
          event.preventDefault();
          void run(false);
        }}
      >
        <label htmlFor={`${id}-target`} className="block font-medium">
          Edit a panel
        </label>
        <NativeSelect
          id={`${id}-target`}
          value={target}
          disabled={pending || actions.blocked}
          onChange={(event) => setTarget(event.target.value)}
        >
          <NativeSelectOption value="">Choose a panel</NativeSelectOption>
          {panels(view.definition.tree).map((panel) => (
            <NativeSelectOption key={String(panel.props.id)} value={String(panel.props.id)}>
              {String(panel.props.id)}
            </NativeSelectOption>
          ))}
          <NativeSelectOption value="add">Add panel</NativeSelectOption>
        </NativeSelect>
        <label htmlFor={`${id}-prompt`} className="sr-only">
          Panel edit instruction
        </label>
        <Textarea
          ref={editor}
          id={`${id}-prompt`}
          value={prompt}
          disabled={pending || actions.blocked}
          onChange={(event) => setPrompt(event.target.value)}
          placeholder="Make this a bar chart"
        />
        <p className="text-muted-foreground text-xs">
          Recorded examples: “Make this a bar chart” or choose Add panel and enter “Add analytics chart”. Only the five
          available series are supported.
        </p>
        <Button type="submit" disabled={pending || actions.blocked}>
          Apply panel edit
        </Button>
      </form>
    </section>
  );
}
