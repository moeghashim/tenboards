import { Component, type ReactNode, useMemo, useState } from "react";

import { inspectLanguage } from "@/lib/assistant/language";

import { Renderer } from "./openui";
import { assistantLibrary } from "./registry";

export class ResponseBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <p role="status">This response could not be displayed. Try another example.</p>
    ) : (
      this.props.children
    );
  }
}
function ValidatedResponse({ response }: { response: string }) {
  const [failed, setFailed] = useState(false);
  return failed ? (
    <p role="status">This response could not be displayed safely. Try again.</p>
  ) : (
    <Renderer
      response={response}
      library={assistantLibrary}
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
}: {
  text: string;
  complete: boolean;
  pending?: boolean;
}) {
  const result = useMemo(() => inspectLanguage(text, complete), [text, complete]);
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
  return (
    <ResponseBoundary key={result.response}>
      <ValidatedResponse response={result.response} />
    </ResponseBoundary>
  );
}
