import { dbRoles, demoRoles } from "./roles.ts";
import { dbUsers, demoUsers } from "./users.ts";

// Each exported domain read owns all of its supported input/variant scenarios here.
export const readRegistry = [
  {
    module: "users",
    read: "readUsers",
    scenarios: [
      { name: "all", input: {} },
      { name: "existing", input: { email: "olivia.rhye@weblabs.studio" } },
      { name: "missing", input: { email: "missing@example.invalid" } },
    ],
    demo: demoUsers,
    db: dbUsers,
  },
  {
    module: "roles",
    read: "readRoles",
    scenarios: [
      { name: "all", input: {} },
      { name: "existing", input: { role: "Owner" } },
      { name: "missing", input: { role: "Missing role" } },
    ],
    demo: demoRoles,
    db: dbRoles,
  },
];
