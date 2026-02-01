import { onMounted, onUnmounted } from "vue";

export function useEsc(handler: () => void): void {
  const onKeydown = (e: KeyboardEvent): void => {
    if (e.key === "Escape") {
      handler();
    }
  };

  onMounted(() => {
    window.addEventListener("keydown", onKeydown);
  });

  onUnmounted(() => {
    window.removeEventListener("keydown", onKeydown);
  });
}
