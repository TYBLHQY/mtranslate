import { onUnmounted } from "vue";

type Handler = (e: KeyboardEvent) => void;

function normalizePattern(pattern: string): string {
  return pattern
    .split("+")
    .map(p => p.trim())
    .filter(Boolean)
    .map(p => (p.toLowerCase() === "ctrl" ? "ctrl" : p))
    .join("+");
}

function matchesPattern(e: KeyboardEvent, pattern: string): boolean {
  const parts = pattern.split("+").map(p => p.toLowerCase());

  // modifiers
  if (parts.includes("ctrl") !== e.ctrlKey) return false;
  if (parts.includes("alt") !== e.altKey) return false;
  if (parts.includes("shift") !== e.shiftKey) return false;
  if (parts.includes("meta") !== e.metaKey) return false;

  // remaining part is the key
  const keys = parts.filter(p => !["ctrl", "alt", "shift", "meta"].includes(p));
  if (keys.length === 0) return false;

  const expected = keys[0];
  // compare against e.key (handles punctuation like ',' or letters) case-insensitively
  if (e.key && e.key.toLowerCase() === expected) return true;
  // some special keys like F1..F12
  if (e.code && e.code.toLowerCase().replace(/^key/, "") === expected) return true;

  return false;
}

export function useShortcuts(): {
  registerShortcut: (pattern: string, handler: Handler) => () => void;
  unregisterAll: () => void;
} {
  const handlers: Array<{ pattern: string; handler: Handler }> = [];

  const listener = (e: KeyboardEvent): void => {
    for (const item of handlers) {
      if (matchesPattern(e, item.pattern)) {
        try {
          item.handler(e);
        } catch (err) {
          console.error("shortcut handler error:", err);
        }
      }
    }
  };

  let registered = false;

  const ensureListener = (): void => {
    if (registered) return;
    window.addEventListener("keydown", listener);
    registered = true;
  };

  const registerShortcut = (patternRaw: string, handler: Handler): (() => void) => {
    const pattern = normalizePattern(patternRaw);
    const item = { pattern, handler };
    handlers.push(item);
    ensureListener();
    return () => {
      const idx = handlers.indexOf(item);
      if (idx >= 0) handlers.splice(idx, 1);
    };
  };

  const unregisterAll = (): void => {
    if (!registered) return;
    window.removeEventListener("keydown", listener);
    handlers.length = 0;
    registered = false;
  };

  onUnmounted(() => unregisterAll());

  return { registerShortcut, unregisterAll };
}
