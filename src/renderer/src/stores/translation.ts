import { defineStore } from "pinia";
import { ref } from "vue";

export const useTranslationStore = defineStore("translation", () => {
  const sourceText = ref("");

  const getSourceText = (): string => sourceText.value;
  const setSourceText = (text: string): string => (sourceText.value = text.trim());

  return {
    sourceText: sourceText.value,
    getSourceText,
    setSourceText,
  };
});
