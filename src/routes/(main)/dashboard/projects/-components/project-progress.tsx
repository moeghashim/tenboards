import { Progress } from "@/components/ui/progress";
import type { Metrics } from "@/server/data/projects.types";

export function ProjectProgress({ metrics, name }: { metrics: Metrics; name: string }) {
  const eligible = metrics.total - metrics.canceled;
  return (
    <div className="space-y-1.5">
      <div className="text-muted-foreground flex flex-wrap justify-between gap-x-3 gap-y-1 text-xs">
        <span>
          {metrics.completed} of {eligible} done
        </span>
        <span>{metrics.progress}%</span>
      </div>
      <Progress
        value={metrics.progress}
        aria-label={`${name} completion`}
        aria-valuetext={`${metrics.completed} of ${eligible} done; ${metrics.canceled} canceled excluded`}
      />
      {metrics.canceled > 0 && <p className="text-muted-foreground text-xs">{metrics.canceled} canceled excluded</p>}
    </div>
  );
}
