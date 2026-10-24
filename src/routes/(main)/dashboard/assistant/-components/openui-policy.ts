// Pinned react-lang 1.0.1 otherwise auto-mounts its inspector in development.
// This executes before its entry point; Renderer also opts out of publishing.
Object.defineProperty(globalThis, Symbol.for("openui.devtools.autoMount"), { value: true, configurable: true });
