import { useSettingStore, useTranslationStore } from "@renderer/stores";
import { debounce } from "lodash-es";
import { defineComponent, onBeforeUnmount, onMounted, ref } from "vue";

export default defineComponent(() => {
  const translationStore = useTranslationStore();
  const settingStore = useSettingStore();

  const sourceTextRef = ref<HTMLTextAreaElement>();
  const query = ref<string>();

  const focusInput = (): void => {
    sourceTextRef.value?.focus();
    sourceTextRef.value?.select();
  };

  const debouncedTranslate = debounce(
    () => {
      query.value = sourceTextRef.value?.value ?? "";
      handleTranslate();
    },
    settingStore.getAutoTranslateDelay(),
    { leading: false, trailing: true },
  );
  onBeforeUnmount(() => debouncedTranslate.cancel());
  const handleInput = async (event: KeyboardEvent): Promise<void> => {
    if (event.key === "Enter" && !event.shiftKey) {
      query.value = sourceTextRef.value?.value ?? "";
      event.preventDefault();
      handleTranslate();
      focusInput();
    }
    if (event.key === "Escape") {
      event.preventDefault();
      focusInput();
    }
    if (!settingStore.getAutoTranslate()) return;
    debouncedTranslate();
  };

  const handleTranslate = async (): Promise<void> => {
    translationStore.setSourceText(query.value || "");
    !settingStore.getAutoTranslate() && setTimeout(focusInput, 0);
  };

  onMounted(() => {
    window.api.window.selectedText((text: string) => {
      query.value = text;
      handleTranslate();
    });
    window.api.window.shown(() => focusInput());
    focusInput();
  });

  return () => (
    <div class="flex min-h-0 flex-1">
      <textarea
        class="flex-1 resize-none outline-none"
        ref={sourceTextRef}
        value={translationStore.getSourceText()}
        onKeydown={handleInput}
        placeholder="原文"
      />
    </div>
  );
});
