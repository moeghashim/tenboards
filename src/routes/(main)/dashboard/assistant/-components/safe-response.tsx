import { useMemo, useState } from "react";

import { panels } from "@/lib/assistant/canvas";
import type { DataResultMap } from "@/lib/assistant/data-contract";
import { inspectLanguage } from "@/lib/assistant/language";

import { type CanvasActions, DashboardCanvas } from "./dashboard-canvas";
import { ResponseBoundary } from "./response-boundary";

export { ResponseBoundary } from "./response-boundary";

import { Renderer } from "./openui";
import { AssistantDataProvider, getAssistantLibrary } from "./registry";

function ValidatedResponse({ response }: { response: string }) {
  const [failed, setFailed] = useState(false);
  const library = useMemo(getAssistantLibrary, []);
  return failed ? (
    <p role="status">This response could not be displayed safely. Try again.</p>
  ) : (
    <Renderer
      response={response}
      library={library}
      isStreaming={false}
      publishObservability={false}
      onError={(errors) => {
        if (errors.length) setFailed(true);
      }}
    />
  );
}
export function SafeResponse({
  text,
  complete,
  pending = true,
  results,
  actions,
}: {
  text: string;
  complete: boolean;
  pending?: boolean;
  results?: DataResultMap;
  actions?: CanvasActions;
}) {
  const result = useMemo(() => inspectLanguage(text, complete, results), [text, complete, results]);
  if (result.status === "invalid")
    return (
      <p role="status" className="text-danger">
        The response contained unsupported content. Try another example.
      </p>
    );
  if (!result.response)
    return pending ? (
      <p className="text-muted-foreground flex items-center gap-2">
        <span aria-hidden="true" className="flex gap-1 motion-safe:animate-pulse">
          <span className="size-1 rounded-full bg-current" />
          <span className="size-1 rounded-full bg-current" />
          <span className="size-1 rounded-full bg-current" />
        </span>
        Preparing response…
      </p>
    ) : null;
  if (complete && result.tree && panels(result.tree).length && actions)
    return <DashboardCanvas tree={result.tree} results={results ?? {}} actions={actions} />;
  return (
    <ResponseBoundary key={result.response}>
      <AssistantDataProvider results={results ?? {}}>
        <ValidatedResponse response={result.response} />
      </AssistantDataProvider>
    </ResponseBoundary>
  );
}
