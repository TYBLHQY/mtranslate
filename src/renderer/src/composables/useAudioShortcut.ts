import { onUnmounted, Ref, watch } from "vue";

export function useAudioShortcut<T>(audios: Ref<T[]>, play: (index: number) => void): void {
  let registered = false;

  const handleKeydown = (e: KeyboardEvent): void => {
    if (!e.altKey) return;
    const key = Number(e.key);
    if (Number.isNaN(key)) return;
    const index = key - 1;
    if (index < 0 || index >= audios.value.length) return;
    play(index);
  };

  const register = (): void => {
    if (registered) return;
    window.addEventListener("keydown", handleKeydown);
    registered = true;
  };

  const unregister = (): void => {
    if (!registered) return;
    window.removeEventListener("keydown", handleKeydown);
    registered = false;
  };

  watch(
    () => audios.value.length,
    length => (length > 0 ? register() : unregister()),
    { immediate: true },
  );

  onUnmounted(unregister);
}
