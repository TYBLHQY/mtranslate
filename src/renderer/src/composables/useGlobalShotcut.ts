import { Shortcuts } from "@common/types";
import { useSettingStore } from "@renderer/stores/setting";
import { computed, Ref, ref } from "vue";

export function useShortcut(
  onHandle: () => void,
  onEsc: () => void,
  onEnter: () => void,
): {
  shortcutId: Ref<keyof Shortcuts | undefined>;
  pressedKeys: Ref<Set<string>>;
  pressedKeyString: Ref<string>;
  handleShortcutInput: (shortcutId: keyof Shortcuts) => void;
} {
  const settingStore = useSettingStore();

  const shortcutId = ref<keyof Shortcuts>();
  const pressedKeys = ref<Set<string>>(new Set());
  const pressedKeyString = computed(() => Array.from(pressedKeys.value).join("+"));

  const handleShortcutInput = (shortcutIdValue: keyof Shortcuts): void => {
    removeEventListener("keydown", handleKeyDown);
    shortcutId.value = shortcutIdValue;
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
      if (shortcutId.value) settingStore.setGlobalShortcut(shortcutId.value, pressedKeyString.value);
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
    shortcutId.value = undefined;
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
    shortcutId,
    pressedKeys,
    pressedKeyString,
    handleShortcutInput,
  };
}
