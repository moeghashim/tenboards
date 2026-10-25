import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";

import { ResponseBoundary, SafeResponse } from "../src/routes/(main)/dashboard/assistant/-components/safe-response";

// Development-only browser regression entrypoint, never imported by application code.
export async function run() {
  const host = document.createElement("section");
  host.setAttribute("aria-label", "Renderer safety regression");
  document.querySelector("main")?.append(host);
  const root = createRoot(host, {
    onCaughtError() {
      /* Expected synthetic throw; no output logging. */
    },
  });
  flushSync(() => root.render(<SafeResponse text={'root = iframe("https://invalid.test")'} complete />));
  const rejected = !!host.textContent?.includes("unsupported content") && !host.querySelector("iframe");
  flushSync(() => root.render(<SafeResponse text={'root = Stack([Text("Recovered safely")])'} complete />));
  await new Promise((resolve) => setTimeout(resolve, 100));
  const recovered = host.textContent?.includes("Recovered safely") === true;
  flushSync(() =>
    root.render(
      <ResponseBoundary>
        <Failing />
      </ResponseBoundary>,
    ),
  );
  const boundary = host.textContent?.includes("could not be displayed") === true;
  return { rejected, recovered, boundary };
}

function Failing(): never {
  throw new Error("Synthetic renderer failure");
}
