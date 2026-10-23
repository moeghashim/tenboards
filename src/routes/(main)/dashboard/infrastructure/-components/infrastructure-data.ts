import type { SimpleIcon } from "simple-icons";
import { siNextdotjs, siNodedotjs, siReact, siRemix } from "simple-icons";

export interface InfrastructureEnvironment {
  domain: string;
  platform: {
    name: string;
    icon: SimpleIcon;
  };
  environment: "Expired" | "Production" | "Staging";
  status: "Online" | "Unhealthy";
  latency: string;
  uptime: string;
  server: string;
  countryCode: string;
  plan: string;
  resources: {
    cpu: number;
    ram: number;
    disk: number;
  };
}

export interface InfrastructureGroup {
  name: string;
  organization: string;
  rows: InfrastructureEnvironment[];
}

import type { InfrastructureData } from "@/server/data/infrastructure.types";

const platformIcons = { siNextdotjs, siNodedotjs, siReact, siRemix };
export function presentGroups(groups: InfrastructureData["groups"]): InfrastructureGroup[] {
  return groups.map((group) => ({
    ...group,
    rows: group.rows.map(
      (row) =>
        ({
          ...row,
          platform: { name: row.platform.name, icon: platformIcons[row.platform.icon as keyof typeof platformIcons] },
        }) as InfrastructureEnvironment,
    ),
  }));
}
