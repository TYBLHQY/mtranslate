import { onMounted, onUnmounted } from "vue";

export function useEsc(handler: () => void): { start: () => void; stop: () => void } {
  const onKeydown = (e: KeyboardEvent): void => {
    if (e.key === "Escape") handler();
  };

  const start = (): void => window.addEventListener("keydown", onKeydown);
  const stop = (): void => window.removeEventListener("keydown", onKeydown);

  onMounted(() => start());
  onUnmounted(() => stop());

  return { start, stop };
}
