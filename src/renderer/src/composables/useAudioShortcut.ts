import { onUnmounted, Ref, watch } from "vue";
import { useShortcuts } from "./useShortcuts";

export function useAudioShortcut<T>(audios: Ref<T[]>, play: (index: number) => void): void {
  const { registerShortcut } = useShortcuts();
  let unregisters: Array<() => void> = [];

  const register = (): void => {
    if (unregisters.length > 0) return;
    unregisters = audios.value.map((_, i) =>
      registerShortcut(`Alt+${i + 1}`, () => {
        play(i);
      }),
    );
  };

  const unregister = (): void => {
    while (unregisters.length) {
      const u = unregisters.shift();
      if (u) u();
    }
  };

  watch(
    () => audios.value.length,
    length => (length > 0 ? register() : unregister()),
    { immediate: true },
  );

  onUnmounted(unregister);
}
