import type { ProviderId } from "../../../../../lib/assistant/config.ts";
import { bytes } from "../../../../../lib/assistant/registry.ts";

export type FailureCode =
  | "provider"
  | "timeout"
  | "limit"
  | "refused"
  | "invalid"
  | "unavailable"
  | "configuration"
  | "rate"
  | "origin";
export const failureCopy: Record<FailureCode, string> = {
  provider: "The provider could not reply. Check its key, model access or availability, then try again.",
  timeout: "The reply timed out. Try a shorter question or regenerate when you are ready.",
  limit: "The reply reached a size limit. Shorten your question or start a new conversation.",
  refused: "No usable reply was returned. Rephrase your question and send it again.",
  invalid: "The reply or request was not supported. Check the provider selection, then try a simpler question.",
  unavailable: "The Assistant is unavailable. Try again when the service is ready.",
  configuration: "The provider configuration changed or is unavailable. Check the available providers and try again.",
  rate: "Too many requests. Wait for the countdown, then send or regenerate manually.",
  origin: "This page cannot send from its current address. Open the dashboard at its configured address.",
};
export function failureCode(value: unknown): FailureCode {
  return typeof value === "string" && Object.hasOwn(failureCopy, value) ? (value as FailureCode) : "unavailable";
}
export type Turn = {
  id: number;
  prompt: string;
  attribution: string;
  text: string;
  status: "streaming" | "completed" | "stopped" | "error";
  error?: FailureCode;
};
export type Conversation = { turns: Turn[]; generation: number };
export type Action =
  | { type: "start"; turn: Turn; regenerate: boolean }
  | { type: "update"; id: number; text?: string; status?: Turn["status"]; error?: FailureCode }
  | { type: "clear"; generation: number };
export const initialConversation: Conversation = { turns: [], generation: 0 };
export function conversationReducer(state: Conversation, action: Action): Conversation {
  if (action.type === "clear") return { turns: [], generation: action.generation };
  if (action.type === "start") {
    if (action.turn.id <= state.generation) return state;
    return {
      generation: action.turn.id,
      turns: [...(action.regenerate ? state.turns.slice(0, -1) : state.turns), action.turn],
    };
  }
  if (action.id !== state.generation || state.turns.at(-1)?.status !== "streaming") return state;
  return {
    ...state,
    turns: state.turns.map((turn) =>
      turn.id === action.id
        ? {
            ...turn,
            text: action.text ?? turn.text,
            status: action.status ?? turn.status,
            error: action.error ?? turn.error,
          }
        : turn,
    ),
  };
}
export class ContextLimit extends Error {}
export function requestHistory(turns: Turn[], prompt: string, provider?: ProviderId) {
  if (!prompt.trim() || bytes(prompt) > 8192)
    throw new ContextLimit("Keep your message under 8 KiB. Shorten it and try again.");
  const pairs = turns.filter((turn) => turn.status === "completed");
  const latest = pairs.at(-1);
  if (latest && (bytes(latest.text) > 32768 || bytes(latest.prompt) > 8192))
    throw new ContextLimit(
      "The latest reply is too large to reuse as context. It stays visible here; choose New conversation to continue.",
    );
  let dropped = 0;
  // Remove old oversized pairs as whole units; never shorten language or split a turn.
  const lastOversized = pairs.reduce(
    (last, turn, index) => (bytes(turn.text) > 32768 || bytes(turn.prompt) > 8192 ? index : last),
    -1,
  );
  if (lastOversized >= 0) dropped = pairs.splice(0, lastOversized + 1).length;
  for (;;) {
    const messages = pairs.flatMap((turn) => [
      { role: "user" as const, content: turn.prompt },
      { role: "assistant" as const, content: turn.text },
    ]);
    messages.push({ role: "user", content: prompt });
    const body = JSON.stringify({ provider, messages });
    if (messages.length <= 20 && bytes(body) <= 65536) return { body, dropped };
    if (pairs.length <= 1)
      throw new ContextLimit(
        "The latest exchange is too large to send together. Shorten your message or choose New conversation.",
      );
    pairs.shift();
    dropped++;
  }
}
export function retryDeadline(value: string | null, now = Date.now()) {
  if (!value) return now + 60000;
  const seconds = /^\d+$/.test(value) ? Number(value) : (Date.parse(value) - now) / 1000;
  return now + (Number.isFinite(seconds) ? Math.max(1, seconds) : 60) * 1000;
}
