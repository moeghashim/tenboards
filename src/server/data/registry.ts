import { dbAccounts, demoAccounts } from "./accounts.ts";
import { dbCalendar, demoCalendar } from "./calendar.ts";
import { dbEcommerce, demoEcommerce } from "./ecommerce.ts";
import { dbFiles, demoFiles } from "./files.ts";
import { dbInvoices, demoInvoices } from "./invoices.ts";
import { dbKanban, demoKanban } from "./kanban.ts";
import { dbProducts, demoProducts } from "./products.ts";
import { dbProfile, demoProfile } from "./profile.ts";
import { dbRoles, demoRoles } from "./roles.ts";
import { dbTasks, demoTasks } from "./tasks.ts";
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
    module: "kanban",
    read: "readKanban",
    demo: demoKanban,
    db: dbKanban,
    scenarios: [
      { name: "all", input: {} },
      { name: "existing", input: { id: "tender-workflow-map" } },
      { name: "missing", input: { id: "missing" } },
    ],
  }),
  defineRead({
    module: "tasks",
    read: "readTasks",
    demo: demoTasks,
    db: dbTasks,
    scenarios: [
      { name: "all", input: {} },
      { name: "existing", input: { id: "TASK-8782" } },
      { name: "missing", input: { id: "missing" } },
    ],
  }),
  defineRead({
    module: "files",
    read: "readFiles",
    demo: demoFiles,
    db: dbFiles,
    scenarios: [
      { name: "all", input: {} },
      { name: "existing", input: { id: "product-roadmap" } },
      { name: "missing", input: { id: "missing" } },
    ],
  }),
  defineRead({
    module: "calendar",
    read: "readCalendar",
    demo: demoCalendar,
    db: dbCalendar,
    scenarios: [
      ...[
        "2026-10-23T12:00:00Z",
        "2026-12-31T23:59:59Z",
        "2027-01-01T00:00:01Z",
        "2028-02-29T23:59:59Z",
        "2028-03-01T00:00:01Z",
      ].flatMap((renderedAt) =>
        ["UTC", "America/Chicago", "Pacific/Kiritimati"].map((timeZone) => ({
          name: `${renderedAt}/${timeZone}`,
          input: { renderedAt, timeZone },
        })),
      ),
      { name: "existing", input: { renderedAt: "2026-10-23T12:00:00Z", id: "event-1" } },
      { name: "missing", input: { renderedAt: "2026-10-23T12:00:00Z", id: "missing" } },
    ],
  }),
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
  defineRead({
    module: "products",
    read: "readProducts",
    demo: demoProducts,
    db: dbProducts,
    scenarios: [
      { name: "all", input: {} },
      { name: "existing", input: { id: "p01" } },
      { name: "missing", input: { id: "missing" } },
      { name: "category", input: { category: "Clothing" } },
      { name: "empty-category", input: { category: "missing" } },
    ],
  }),
  defineRead({
    module: "invoices",
    read: "readInvoices",
    demo: demoInvoices,
    db: dbInvoices,
    scenarios: [
      ...[
        "2026-10-23T12:00:00Z",
        "2026-12-31T23:59:59Z",
        "2028-02-28T23:59:59Z",
        "2028-02-29T00:00:00Z",
        "2029-01-01T00:00:00Z",
      ].map((renderedAt) => ({ name: renderedAt, input: { renderedAt } })),
      { name: "missing", input: { renderedAt: "2026-10-23T12:00:00Z", draftId: "missing" } },
    ],
  }),
  defineRead({
    module: "ecommerce",
    read: "readEcommerce",
    demo: demoEcommerce,
    db: dbEcommerce,
    scenarios: [
      { name: "all", input: {} },
      { name: "existing-order", input: { orderId: "#14550" } },
      { name: "missing-order", input: { orderId: "missing" } },
    ],
  }),
];
