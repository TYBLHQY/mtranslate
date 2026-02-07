import { useTranslationStore } from "@renderer/stores/translation";
import { defineComponent, onMounted, ref } from "vue";

export default defineComponent({
  setup() {
    const sourceTextRef = ref<HTMLTextAreaElement>();
    const query = ref<string>();
    const translationStore = useTranslationStore();

    const focusInput = (): void => {
      sourceTextRef.value?.focus();
      sourceTextRef.value?.select();
    };

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
    };

    const handleTranslate = async (): Promise<void> => {
      translationStore.setSourceText(query.value || "");
      setTimeout(focusInput, 0);
    };

    window.api.window.selectedText((text: string) => {
      query.value = text;
      handleTranslate();
    });
    onMounted(() => focusInput());

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
  },
});
