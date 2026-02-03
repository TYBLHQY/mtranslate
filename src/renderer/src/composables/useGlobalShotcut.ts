import { computed, Ref, ref } from "vue";

export function useShortcut(
  onHandle: () => void,
  onEsc: () => void,
  onEnter: () => void,
): {
  pressedKeys: Ref<Set<string>>;
  pressedKeyString: Ref<string>;
  handleShortcutInput: () => void;
} {
  const pressedKeys = ref<Set<string>>(new Set());
  const pressedKeyString = computed(() => Array.from(pressedKeys.value).join("+"));

  const handleShortcutInput = (): void => {
    onHandle();
    pressedKeys.value.clear();
    addEventListener("keydown", handleKeyDown);
  };

  const handleKeyDown = (e: KeyboardEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    if (e.code === "Escape") {
      onEsc();
      reset();
      return;
    }
    if (e.code === "Enter") {
      onEnter();
      reset();
      return;
    }
    if (e.code === "Backspace") {
      pressedKeys.value.clear();
      return;
    }

    pressedKeys.value.clear();

    if (e.altKey) pressedKeys.value.add("Alt");
    if (e.ctrlKey) pressedKeys.value.add("Ctrl");
    if (e.shiftKey) pressedKeys.value.add("Shift");
    if (e.metaKey) pressedKeys.value.add("Meta");

    if (pressedKeys.value.has(e.code)) return;
    pressedKeys.value.add(normalizeKey(e.code));
  };

  const reset = (): void => {
    pressedKeys.value.clear();
    removeEventListener("keydown", handleKeyDown);
  };

  const normalizeKey = (key: string): string => {
    return key
      .replace(/^Key/, "")
      .replace(/^Digit/, "")
      .replace(/^ControlLeft/, "Ctrl")
      .replace(/^ControlRight/, "Ctrl")
      .replace(/^ShiftLeft/, "Shift")
      .replace(/^ShiftRight/, "Shift")
      .replace(/^AltLeft/, "Alt")
      .replace(/^AltRight/, "Alt")
      .replace(/^MetaLeft/, "Meta")
      .replace(/^MetaRight/, "Meta");
  };

  return {
    pressedKeys,
    pressedKeyString,
    handleShortcutInput,
  };
}
