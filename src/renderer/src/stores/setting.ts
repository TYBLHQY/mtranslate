import { defaultSettings, Proxy, Services, Settings, Shortcuts, themeOptions } from "@common/types";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

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
  const setResizable = (): void => {
    settings.value.resizable = !settings.value.resizable;
    window.api.setting.setResizable(settings.value.resizable);
  };

  const getSilent = (): boolean => settings.value.silent;
  const setSilent = (): void => {
    settings.value.silent = !settings.value.silent;
    window.api.setting.setSilent(settings.value.silent);
  };

  const getAutoTranslate = (): boolean => settings.value.autoTranslate;
  const setAutoTranslate = (): void => {
    settings.value.autoTranslate = !settings.value.autoTranslate;
    window.api.setting.setAutoTranslate(settings.value.autoTranslate);
  };

  const getAutoTranslateDelay = (): number => settings.value.autoTranslateDelay;
  const setAutoTranslateDelay = (value: number): void => {
    settings.value.autoTranslateDelay = value;
    window.api.setting.setAutoTranslateDelay(settings.value.autoTranslateDelay);
  };

  const getGlobalShortcuts = (): Shortcuts => settings.value.globalShortcuts;
  const setGlobalShortcut = <K extends keyof Shortcuts>(id: K, map: string): void => {
    settings.value.globalShortcuts[id] = map;
    window.api.setting.setGlobalShortcut(id, map);
  };

  const getPronunciationMode = (): "hover" | "click" => settings.value.pronunciationMode;
  const setPronunciationMode = (): void => {
    settings.value.pronunciationMode = settings.value.pronunciationMode === "hover" ? "click" : "hover";
    window.api.setting.setPronunciationMode(settings.value.pronunciationMode);
  };

  const getAppVersion = (): string => settings.value.appVersion;
  const getDbVersion = (): number => settings.value.dbVersion;

  const getProxy = (): Proxy => settings.value.proxy;
  const setProxy = (proxy: Proxy): void => {
    settings.value.proxy = proxy;
    window.api.setting.setProxy(proxy);
  };

  const getWindowToggleBehavior = (): "focus-if-shown" | "hide-if-shown" => settings.value.windowToggleBehavior;
  const setWindowToggleBehavior = (behavior: "focus-if-shown" | "hide-if-shown"): void => {
    settings.value.windowToggleBehavior = behavior;
    window.api.setting.setWindowToggleBehavior(behavior);
  };

  const getServicesConfig = (): Services => settings.value.servicesConfig;
  const setServiceConfig = <K extends keyof Services, T extends keyof Services[K]>(service: K, field: T, value: Services[K][T]): void => {
    settings.value.servicesConfig[service][field] = value;
    window.api.setting.setServiceConfig(service, field, value);
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
    getAutoTranslate,
    setAutoTranslate,
    getAutoTranslateDelay,
    setAutoTranslateDelay,
    getGlobalShortcuts,
    setGlobalShortcut,
    getPronunciationMode,
    setPronunciationMode,
    getAppVersion,
    getDbVersion,
    getProxy,
    setProxy,
    getWindowToggleBehavior,
    setWindowToggleBehavior,
    getServicesConfig,
    setServiceConfig,
  };
});
