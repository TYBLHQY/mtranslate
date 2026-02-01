import { Settings } from "@common/types";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useSettingStore = defineStore("setting", () => {
  const settings = ref<Settings>({ theme: "mocha" });

  const getTheme = (): string => {
    return settings.value?.theme;
  };
  const setTheme = (theme: string): void => {
    settings.value = { ...settings.value, theme };
  };

  return {
    settings,
    getTheme,
    setTheme,
  };
});
