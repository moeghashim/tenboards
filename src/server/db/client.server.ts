import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { databaseUrl } from "../data/source.ts";
import { runtimeEnvironment, workerRequestScope } from "../runtime.server.ts";
import { AsyncLocalStorage } from "node:async_hooks";

// Importing this module never opens a connection. Demo never calls getDatabase.
let client: ReturnType<typeof postgres> | undefined;
const databaseKey = Symbol("request database");
const toolDatabase = new AsyncLocalStorage<ReturnType<typeof drizzle>>();
function createClient(workers: boolean) {
  return postgres(databaseUrl(runtimeEnvironment()), {
    max: workers ? 1 : 4,
    connect_timeout: 3,
    idle_timeout: 5,
    onnotice: () => undefined,
  });
}
function getClient() {
  const scope = workerRequestScope();
  if (scope) {
    let requestClient = scope.resources.get(databaseKey) as ReturnType<typeof postgres> | undefined;
    if (!requestClient) {
      requestClient = createClient(true);
      scope.resources.set(databaseKey, requestClient);
      const owned = requestClient;
      scope.cleanup.push(() => owned.end({ timeout: 1 }));
    }
    return requestClient;
  }
  client ??= createClient(false);
  return client;
}
export function getDatabase() {
  return toolDatabase.getStore() ?? drizzle(getClient());
}

export function assertReadActive(signal: AbortSignal, deadline: number) {
  if (signal.aborted || Date.now() >= deadline) throw new Error("Data read cancelled or timed out.");
}

// Only tool/refresh callers enter this scope. Ordinary session/admission reads retain
// their existing behavior. No SQL or driver error is exposed at this boundary.
export async function withToolTransaction<T>(
  signal: AbortSignal,
  deadline: number,
  read: () => Promise<T>,
): Promise<T> {
  assertReadActive(signal, deadline);
  if (deadline - Date.now() < 500) throw new Error("Data read timed out before it could start.");
  const pending = new Set<PromiseLike<unknown> & { cancel(): void }>();
  const cancel = () => {
    for (const query of pending) query.cancel();
  };
  const timer = setTimeout(cancel, Math.max(1, deadline - Date.now()));
  signal.addEventListener("abort", cancel, { once: true });
  try {
    const pool = getClient();
    const result = await pool.begin(async (transaction) => {
      assertReadActive(signal, deadline);
      const remaining = Math.floor(deadline - Date.now());
      if (remaining < 500) throw new Error("Data read timed out before it could start.");
      const timeout = Math.min(4750, remaining - 250);
      // Integer derived exclusively from the server clock, never model/client SQL.
      await transaction.unsafe(`SET LOCAL statement_timeout = ${timeout}`);
      await transaction.unsafe(`SET LOCAL idle_in_transaction_session_timeout = ${timeout}`);
      assertReadActive(signal, deadline);
      const tracked = new Proxy(transaction, {
        get(target, property, receiver) {
          if (property === "options") return pool.options;
          if (property !== "unsafe") return Reflect.get(target, property, receiver);
          return (...args: Parameters<typeof transaction.unsafe>) => {
            assertReadActive(signal, deadline);
            const query = transaction.unsafe(...args);
            pending.add(query);
            // Preserve the lazy pending-query handle, including Drizzle's values().
            // Defer observation so values() can select its row mode first.
            queueMicrotask(() => {
              void query.then(
                () => pending.delete(query),
                () => pending.delete(query),
              );
            });
            return query;
          };
        },
      });
      try {
        // Drizzle uses only unsafe() for reads; postgres's TransactionSql deliberately
        // omits pool lifecycle methods from its type.
        const database = drizzle(tracked as unknown as postgres.Sql);
        const value = await toolDatabase.run(database, read);
        assertReadActive(signal, deadline);
        return value;
      } finally {
        cancel();
        await Promise.allSettled([...pending]);
      }
    });
    assertReadActive(signal, deadline);
    return result as T;
  } catch {
    throw new Error("Unable to load dashboard data. The read failed, was cancelled, or timed out.");
  } finally {
    clearTimeout(timer);
    signal.removeEventListener("abort", cancel);
  }
}
export async function closeDatabase() {
  await client?.end({ timeout: 1 });
  client = undefined;
}
