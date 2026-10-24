import { useCallback, useEffect, useReducer, useRef, useState } from "react";

import type { AssistantConfig, ProviderId } from "@/lib/assistant/config";
import { inspectLanguage } from "@/lib/assistant/language";
import { getAssistantConfig } from "@/lib/assistant/server-functions";
import { consumeStream, StreamFailure } from "@/lib/assistant/transport";
import { getAuthState } from "@/lib/auth/server-functions";

import {
  conversationReducer,
  failureCode,
  initialConversation,
  requestHistory,
  responseFailure,
  retryDeadline,
} from "./conversation";

export function useConversation(initialConfig: AssistantConfig) {
  const [config, setConfig] = useState(initialConfig);
  const [provider, setProvider] = useState<ProviderId | undefined>(initialConfig.providers[0]?.id);
  const [selectionRequired, setSelectionRequired] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const selected = config.providers.find((item) => item.id === provider);
  const [state, dispatch] = useReducer(conversationReducer, initialConversation);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [contextNotice, setContextNotice] = useState(false);
  const [expired, setExpired] = useState(false);
  const [retryAt, setRetryAt] = useState(0);
  const [now, setNow] = useState(0);
  const active = useRef<AbortController | null>(null);
  const generation = useRef(0);
  const composer = useRef<HTMLTextAreaElement>(null);
  const stopButton = useRef<HTMLButtonElement>(null);
  const signIn = useRef<HTMLAnchorElement>(null);
  const follow = useRef<boolean>(true);
  const transcript = useRef<HTMLDivElement>(null);
  const [away, setAway] = useState(false);
  const jumpToLatest = useCallback(() => {
    follow.current = true;
    setAway(false);
    const node = transcript.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, []);
  const trackScroll = useCallback(() => {
    const node = transcript.current;
    if (!node) return;
    follow.current = node.scrollHeight - node.clientHeight - node.scrollTop < 160;
    setAway(!follow.current);
  }, []);
  const busy = state.turns.at(-1)?.status === "streaming";
  const remaining = Math.max(0, Math.ceil((retryAt - now) / 1000));
  const blocked = busy || expired || refreshing || selectionRequired || remaining > 0;
  const clear = useCallback((sessionLost = false) => {
    const id = ++generation.current;
    active.current?.abort();
    active.current = null;
    dispatch({ type: "clear", generation: id });
    setInput("");
    follow.current = true;
    setAway(false);
    setError("");
    setContextNotice(false);
    setRefreshing(false);
    if (sessionLost) setExpired(true);
    else composer.current?.focus();
  }, []);
  useEffect(() => {
    if (expired) signIn.current?.focus();
  }, [expired]);
  useEffect(() => {
    const hide = () => clear();
    window.addEventListener("pagehide", hide);
    return () => {
      generation.current++;
      active.current?.abort();
      active.current = null;
      window.removeEventListener("pagehide", hide);
    };
  }, [clear]);
  useEffect(() => {
    if (!retryAt) return;
    setNow(Date.now());
    const timer = setInterval(() => {
      const time = Date.now();
      setNow(time);
      if (time >= retryAt) clearInterval(timer);
    }, 1000);
    return () => clearInterval(timer);
  }, [retryAt]);
  useEffect(() => {
    // Observe rendered blocks as well as chunks: a chart can finish laying out later.
    const node = transcript.current;
    const content = node?.firstElementChild;
    if (!node || !content) return;
    const observer = new ResizeObserver(() => {
      if (follow.current) node.scrollTop = node.scrollHeight;
    });
    observer.observe(content);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (follow.current && state.turns.length) jumpToLatest();
  }, [state.turns, jumpToLatest]);
  async function refresh(id: number) {
    if (generation.current !== id) return;
    setRefreshing(true);
    try {
      const next = await getAssistantConfig();
      if (generation.current !== id) return;
      setConfig(next);
      // A removed provider needs an explicit choice, even if the next source is recorded.
      if (
        (provider !== undefined || next.providers.length > 0) &&
        !next.providers.some((item) => item.id === provider)
      ) {
        setProvider(undefined);
        setSelectionRequired(true);
      }
    } catch {
      try {
        const auth = await getAuthState();
        if (generation.current === id && auth.mode === "auth" && !auth.user) clear(true);
      } catch {
        /* Keep the failure visible; never downgrade to a demo source. */
      }
    } finally {
      if (generation.current === id) setRefreshing(false);
    }
  }
  async function send(prompt = input, regenerate = false) {
    if (active.current || blocked || !prompt.trim()) return;
    let history: ReturnType<typeof requestHistory>;
    try {
      history = requestHistory(regenerate ? state.turns.slice(0, -1) : state.turns, prompt, provider);
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Start a new conversation.");
      return;
    }
    const id = ++generation.current;
    const controller = new AbortController();
    active.current = controller;
    setError("");
    setContextNotice(history.dropped > 0);
    if (!regenerate) setInput("");
    follow.current = true;
    composer.current?.focus();
    dispatch({
      type: "start",
      regenerate,
      turn: {
        id,
        prompt,
        text: "",
        status: "streaming",
        attribution: selected ? `${selected.name} · ${selected.model}` : "Recorded demo",
      },
    });
    let needsRefresh = false;
    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        credentials: "same-origin",
        signal: controller.signal,
        headers: { "Content-Type": "application/json" },
        body: history.body,
      });
      if (generation.current !== id) {
        await response.body?.cancel();
        return;
      }
      if (response.status === 401) {
        await response.body?.cancel();
        clear(true);
        return;
      }
      if (!response.ok) {
        const safe = await responseFailure(response);
        if (generation.current !== id) return;
        if (safe === "rate") {
          setNow(Date.now());
          setRetryAt(retryDeadline(response.headers.get("Retry-After")));
        }
        throw new StreamFailure(safe);
      }
      if (!response.body) throw new StreamFailure("unavailable");
      const text = await consumeStream(response.body, controller.signal, (text) => {
        if (generation.current === id) dispatch({ type: "update", id, text });
      });
      if (inspectLanguage(text, true).status !== "ready") throw new StreamFailure("invalid");
      dispatch({ type: "update", id, text, status: "completed" });
    } catch (failure) {
      if (generation.current !== id) return;
      const code = failure instanceof StreamFailure ? failureCode(failure.code) : "unavailable";
      dispatch({ type: "update", id, status: controller.signal.aborted ? "stopped" : "error", error: code });
      if (!controller.signal.aborted) {
        setInput((current) => current || prompt);
        needsRefresh = ["provider", "configuration", "invalid"].includes(code);
      }
    } finally {
      if (generation.current === id) {
        active.current = null;
        if (document.activeElement === stopButton.current) composer.current?.focus();
        if (needsRefresh) await refresh(id);
      }
    }
  }
  function stop() {
    active.current?.abort();
    active.current = null;
    dispatch({ type: "update", id: generation.current, status: "stopped" });
    generation.current++; // Invalidate pending errors/chunks before another request can begin.
    composer.current?.focus();
  }
  return {
    config,
    provider,
    selected,
    select: (id: ProviderId) => {
      setProvider(id);
      setSelectionRequired(false);
    },
    selectionRequired,
    chooseRecorded: () => {
      setProvider(undefined);
      setSelectionRequired(false);
    },
    refreshing,
    turns: state.turns,
    input,
    setInput,
    error,
    contextNotice,
    expired,
    remaining,
    busy,
    blocked,
    composer,
    stopButton,
    signIn,
    transcript,
    trackScroll,
    away,
    jumpToLatest,
    clear,
    stop,
    send,
    regenerate: () => {
      const latest = state.turns.at(-1);
      if (latest) void send(latest.prompt, true);
    },
  };
}
