import { defaultSettings, Proxy, ServicesConfig, Settings, Shortcut, themeOptions } from "@common/types";
import { defineStore } from "pinia";
import { computed, ref, toRaw } from "vue";

export const useSettingStore = defineStore("setting", () => {
  const settings = ref<Settings>(defaultSettings);

  const theme = computed(() => settings.value.theme);
  const font = computed(() => settings.value.font || "system-ui");
  const service = computed(() => settings.value.service || "youdao-new");

  const initSettings = (newSettings: Settings): void => {
    Object.assign(settings.value, newSettings);
  };

  const getTheme = (): string => theme.value;
  const setTheme = (themeValue: keyof typeof themeOptions): void => {
    settings.value.theme = themeValue;
    window.api.setting.setTheme(themeValue);
  };

  const getFont = (): string => font.value;
  const setFont = (fontValue: string): void => {
    settings.value.font = fontValue;
    window.api.setting.setFont(fontValue);
  };

  const getService = (): string => service.value;
  const setService = (serviceValue: string): void => {
    settings.value.service = serviceValue;
    window.api.setting.setService(serviceValue);
  };

  const getResizable = (): boolean => settings.value.resizable;
  const setResizable = (resizable: boolean): void => {
    settings.value.resizable = resizable;
    window.api.setting.setResizable(resizable);
  };

  const getSilent = (): boolean => settings.value.silent;
  const setSilent = (silent: boolean): void => {
    settings.value.silent = silent;
    window.api.setting.setSilent(silent);
  };

  const getGlobalShortcuts = (): Shortcut[] => settings.value.globalShortcuts;
  const setGlobalShortcut = (shortcuts: Shortcut): void => {
    settings.value.globalShortcuts = settings.value.globalShortcuts.map(s =>
      s.id === shortcuts.id ? shortcuts : s,
    );
    window.api.setting.setGlobalShortcut(shortcuts);
  };

  const getPronunciationMode = (): "hover" | "click" => settings.value.pronunciationMode;
  const setPronunciationMode = (): void => {
    settings.value.pronunciationMode = settings.value.pronunciationMode === "hover" ? "click" : "hover";
    window.api.setting.setPronunciationMode(settings.value.pronunciationMode);
  };

  const getAppVersion = (): string => settings.value.appVersion;

  const getProxy = (): Proxy => settings.value.proxy;
  const setProxy = (proxy: Proxy): void => {
    settings.value.proxy = proxy;
    window.api.setting.setProxy(proxy);
  };

  const getServicesConfig = (): ServicesConfig => settings.value.servicesConfig;
  const setServiceConfig = <K extends keyof ServicesConfig>(
    service: K,
    config: Partial<ServicesConfig[K]>,
  ): void => {
    settings.value.servicesConfig[service] = {
      ...settings.value.servicesConfig[service],
      ...config,
    };
    window.api.setting.setServiceConfig(toRaw(settings.value.servicesConfig));
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
    getResizable,
    setResizable,
    getSilent,
    setSilent,
    getGlobalShortcuts,
    setGlobalShortcut,
    getPronunciationMode,
    setPronunciationMode,
    getAppVersion,
    getProxy,
    setProxy,
    getServicesConfig,
    setServiceConfig,
  };
});
