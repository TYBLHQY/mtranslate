import { useTranslationStore } from "@renderer/stores/translation";
import { watch } from "vue";

export function useTranslation(translate: () => void): void {
  watch(
    () => useTranslationStore().getSourceText(),
    t => t && translate(),
    { immediate: true },
  );
}
