import { useState } from "react";

import { Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CodeBlock, CodeBlockContent, CodeBlockHeader, CodeBlockTitle } from "@/components/ui/code-block";

const commands = `git clone https://github.com/moeghashim/tenboards.git
cd tenboards
OPENUI_TELEMETRY_DISABLED=1 DO_NOT_TRACK=1 npm install
npm run dev`;

export function QuickStart() {
  const [status, setStatus] = useState("");
  return (
    <div className="min-w-0 space-y-2">
      <CodeBlock className="bg-card">
        <CodeBlockHeader className="flex-wrap justify-between">
          <CodeBlockTitle>Start locally</CodeBlockTitle>
          <Button
            variant="ghost"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(commands);
                setStatus("Quick start commands copied.");
              } catch {
                setStatus("Copy unavailable. Select and copy the commands below.");
              }
            }}
          >
            <Copy aria-hidden="true" /> Copy commands
          </Button>
        </CodeBlockHeader>
        <CodeBlockContent wrap role="region" aria-label="Quick start commands">
          {commands}
        </CodeBlockContent>
      </CodeBlock>
      <p role="status" className="text-muted-foreground min-h-6 text-sm">
        {status}
      </p>
    </div>
  );
}
