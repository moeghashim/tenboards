import { dbAccounts, demoAccounts } from "./accounts.ts";
import { dbProfile, demoProfile } from "./profile.ts";
import { dbRoles, demoRoles } from "./roles.ts";
import { dbUsers, demoUsers } from "./users.ts";

// Each exported domain read owns all of its supported input/variant scenarios here.
function defineRead<Input, Output>(entry: {
  module: string;
  read: string;
  demo: (input: Input) => Promise<Output>;
  db: (input: Input) => Promise<Output>;
  scenarios: { name: string; input: Input }[];
}) {
  return {
    module: entry.module,
    read: entry.read,
    demo: entry.demo,
    db: entry.db,
    scenarios: entry.scenarios.map(({ name, input }) => ({
      name,
      demo: (): Promise<unknown> => entry.demo(input),
      db: (): Promise<unknown> => entry.db(input),
    })),
  };
}

export const readRegistry = [
  defineRead({
    module: "users",
    read: "readUsers",
    scenarios: [
      { name: "all", input: {} },
      { name: "existing", input: { email: "olivia.rhye@weblabs.studio" } },
      { name: "missing", input: { email: "missing@example.invalid" } },
    ],
    demo: demoUsers,
    db: dbUsers,
  }),
  defineRead({
    module: "roles",
    read: "readRoles",
    scenarios: [
      { name: "all", input: {} },
      { name: "existing", input: { role: "Owner" } },
      { name: "missing", input: { role: "Missing role" } },
    ],
    demo: demoRoles,
    db: dbRoles,
  }),
  defineRead({
    module: "accounts",
    read: "readAccounts",
    demo: demoAccounts,
    db: dbAccounts,
    scenarios: [
      { name: "all", input: {} },
      { name: "existing", input: { id: "1" } },
      { name: "missing", input: { id: "absent" } },
    ],
  }),
  defineRead({
    module: "profile",
    read: "readProfile",
    demo: demoProfile,
    db: dbProfile,
    scenarios: [
      { name: "default", input: {} },
      { name: "existing", input: { id: "WS-2301" } },
      { name: "missing", input: { id: "absent" } },
    ],
  }),
];
