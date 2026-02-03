import { defaultSettings, Settings } from "@common/types";
import { defineStore } from "pinia";
import { computed, reactive } from "vue";

export const useSettingStore = defineStore("setting", () => {
  const settings = reactive<Settings>(defaultSettings);

  const theme = computed(() => settings.theme);
  const font = computed(() => settings.font || "system-ui");
  const service = computed(() => settings.service || "youdao-new");

  const initSettings = (newSettings: Settings): void => {
    Object.assign(settings, newSettings);
  };

  const getTheme = (): string => theme.value;
  const setTheme = (themeValue: string): void => {
    settings.theme = themeValue;
    window.api.setting.setTheme(themeValue);
  };

  const getFont = (): string => font.value;
  const setFont = (fontValue: string): void => {
    settings.font = fontValue;
    window.api.setting.setFont(fontValue);
  };

  const getService = (): string => service.value;
  const setService = (serviceValue: string): void => {
    settings.service = serviceValue;
    window.api.setting.setService(serviceValue);
  };

  return {
    settings,
    theme,
    font,
    service,
    initSettings,
    getTheme,
    setTheme,
    getFont,
    setFont,
    getService,
    setService,
  };
});
