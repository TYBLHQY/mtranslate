import { onMounted, onUnmounted } from "vue";
import { useShortcuts } from "./useShortcuts";

export function useEsc(handler: () => void): { start: () => void; stop: () => void } {
  const { registerShortcut } = useShortcuts();
  let unregister: (() => void) | undefined;

  const start = (): void => {
    if (unregister) return;
    unregister = registerShortcut("Escape", () => handler());
  };

  const stop = (): void => {
    if (!unregister) return;
    unregister();
    unregister = undefined;
  };

  onMounted(() => start());
  onUnmounted(() => stop());

  return { start, stop };
}
