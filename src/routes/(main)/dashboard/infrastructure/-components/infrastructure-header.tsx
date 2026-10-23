import { Box, Container, Filter, PlusCircle, RefreshCw, Search, Server, Settings } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

import { useDashboardData } from "./data-context";

export function InfrastructureHeader() {
  const header = useDashboardData().header;
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 flex-col gap-1">
            <h1 className="text-2xl leading-tight font-medium tracking-tight">Infrastructure Overview</h1>
            <p className="text-muted-foreground text-sm">
              Monitor environments, server health, uptime, and resource usage across every project.
            </p>
          </div>

          <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-end">
            <span className="text-muted-foreground text-sm whitespace-nowrap">Demo snapshot</span>
            <div className="flex items-center gap-2">
              <Button aria-label="Refresh infrastructure" variant="outline" size="icon-sm">
                <RefreshCw />
              </Button>
              <Button aria-label="Infrastructure settings" variant="outline" size="icon-sm">
                <Settings data-icon="inline-start" />
              </Button>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="h-auto gap-1 rounded-sm px-1.5 py-0.5">
            <Container />
            {`${header.projects} Projects`}
          </Badge>
          <Badge variant="outline" className="h-auto gap-1 rounded-sm px-1.5 py-0.5">
            <Box />
            {`${header.environments} Environments`}
          </Badge>
          <Badge variant="outline" className="h-auto gap-1 rounded-sm px-1.5 py-0.5">
            <Server />
            {`${header.servers} Servers`}
          </Badge>
          <Badge variant="outline" className="h-auto gap-1 rounded-sm px-1.5 py-0.5">
            <span className="bg-success size-2 rounded-full" />
            {`${header.uptime} Global Uptime`}
          </Badge>
        </div>
      </div>

      <div className="flex flex-col gap-3 xl:flex-row">
        <InputGroup className="flex-1">
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupInput aria-label="Search environments" placeholder="Search by name or domain..." />
        </InputGroup>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline">
            <PlusCircle data-icon="inline-start" />
            Organization
          </Button>
          <Button variant="outline">
            <PlusCircle data-icon="inline-start" />
            Stack
          </Button>
          <Button variant="outline">
            <PlusCircle data-icon="inline-start" />
            Cloud provider
          </Button>
          <Button variant="outline">
            <PlusCircle data-icon="inline-start" />
            Project type
          </Button>
          <Button variant="outline">
            <PlusCircle data-icon="inline-start" />
            Environment
          </Button>
          <Button variant="outline">
            <Filter data-icon="inline-start" />
            Filters
          </Button>
        </div>
      </div>
    </div>
  );
}
