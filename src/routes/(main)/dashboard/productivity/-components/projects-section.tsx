import { ClipboardCheck, Globe, Orbit, Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { DashboardCard as Card, SectionHeader } from "../../-components/dashboard/cards";
import { useDashboardData } from "./data-context";

const projectFilterItems = [
  { value: "active", label: "Active" },
  { value: "planning", label: "Planning" },
  { value: "completed", label: "Completed" },
] as const;

const projectIcons = { Orbit, Globe, ClipboardCheck };
export function ProjectsSection() {
  const projects = useDashboardData().projects.map((project) => ({
    ...project,
    icon: projectIcons[project.icon as keyof typeof projectIcons],
  }));
  return (
    <section className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-medium tracking-tight">Projects</h2>
        <div className="flex items-center gap-2">
          <Select defaultValue="active" items={projectFilterItems}>
            <SelectTrigger aria-label="Project status" className="w-28">
              <SelectValue placeholder="Active" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {projectFilterItems.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Plus data-icon="inline-start" />
            New
          </Button>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.title} density="compact">
            <SectionHeader
              title={
                <span className="flex items-center gap-2">
                  <project.icon className="text-muted-foreground size-4" />
                  <span>{project.title}</span>
                </span>
              }
              actions={
                <Badge variant="outline" className="text-xs">
                  {project.status}
                </Badge>
              }
              level={3}
            />
            <CardContent>
              <div className="flex flex-col gap-3">
                <div className="text-sm leading-snug">{project.description}</div>
                <div className="flex items-center gap-3">
                  <Progress
                    aria-label={`${project.title} progress`}
                    value={project.progress}
                    className="min-w-0 flex-1"
                  />
                  <span className="shrink-0 text-sm tabular-nums">{project.progress}%</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="py-2.5">
              <span className="text-muted-foreground text-xs">{project.due}</span>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
