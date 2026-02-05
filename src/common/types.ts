import { ProgressInfo } from "electron-updater";

export type Option = { code: string; name: string };

export interface QueryData {
  langfrom: string;
  langto: string;
  raw: string;
}

export const translateServices: Option[] = [
  { name: "有道 NEW", code: "youdao-new" },
  { name: "有道 OLD", code: "youdao-old" },
] as const;

export interface YoudaoNewResponse {
  exp: Array<{ po: string; tr: string[] }>;
  examType: string[];
  audio: Array<{ text: string; url: string }>;
  form: Array<{ form: string; type: string }>;
}

export interface YoudaoOldResponse {
  text: string;
  audio: Array<{ text: string; url: string }>;
  error?: string;
}

export const languages: Option[] = [
  { code: "zh-CN", name: "简体中文" },
  { code: "zh-TW", name: "繁體中文" },
  { code: "en", name: "English" },
  { code: "ja", name: "日本語" },
  { code: "ko", name: "한국어" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
  { code: "es", name: "Español" },
  { code: "pt", name: "Português" },
  { code: "ru", name: "Русский" },
] as const;
export type LanguageCode = (typeof languages)[number]["code"];
export type LanguageName = (typeof languages)[number]["name"];

// Settings
export type ShortcutId = "openAndClose" | "copyText";
export type PronunciationMode = "hover" | "click";
export interface Shortcut {
  id: ShortcutId;
  key: string;
  name: string;
}
export interface Proxy extends Electron.ProxyConfig {
  url: string;
  port: number;
  username: string;
  password: string;
  pacScript: string;
  proxyBypassRules: string;
}
export const proxyOptions: Option[] = [
  { code: "system", name: "系统代理" },
  { code: "direct", name: "直连" },
  { code: "fixed_servers", name: "手动配置代理" },
  { code: "pac_script", name: "PAC脚本" },
  { code: "auto_detect", name: "自动检测代理" },
] as const;
export interface Settings {
  appVersion: string;
  dbVersion: number;
  theme: string;
  font: string;
  silent: boolean;
  resizable: boolean;
  bounds: Electron.Rectangle;
  service: string;
  pronunciationMode: PronunciationMode;
  globalShortcuts: Shortcut[];
  proxy: Proxy;
}
export const defaultSettings: Settings = {
  appVersion: "1.0.0",
  dbVersion: 1,
  theme: "mocha",
  font: "system-ui",
  silent: false,
  resizable: false,
  bounds: { x: 0, y: 0, width: 330, height: 600 },
  service: "youdao-new",
  pronunciationMode: "hover",
  globalShortcuts: [
    { id: "openAndClose", key: "", name: "打开关闭窗口" },
    { id: "copyText", key: "", name: "翻译选中文本" },
  ],
  proxy: {
    mode: "system",
    proxyBypassRules: "",
    pacScript: "",
    url: "",
    port: 0,
    username: "",
    password: "",
  },
} as const;

// IPC
export interface API {
  translate: {
    youdaoOld: (data: QueryData) => Promise<YoudaoOldResponse>;
    youdaoNew: (data: QueryData) => Promise<YoudaoNewResponse>;
  };
  setting: {
    getSettings: () => Promise<Settings>;
    setTheme: (theme: string) => Promise<void>;
    setFont: (font: string) => Promise<void>;
    setService: (service: string) => Promise<void>;
    setPronunciationMode: (mode: PronunciationMode) => Promise<void>;
    setResizable: (resize: boolean) => Promise<void>;
    setSilent: (silent: boolean) => Promise<void>;
    setGlobalShortcut: (shortcut: Shortcut) => Promise<void>;
    setProxy: (proxy: Proxy) => Promise<void>;
  };
  window: {
    capture: () => Promise<void>;
    shown: (fn: () => void) => void;
    selectedText: (fn: (text: string) => void) => void;
    openExternal: (url: string) => void;
    getFonts: () => Promise<string[]>;
  };
  update: {
    getAvailable: (fn: (available: boolean) => void) => void;
    getDownloadProgress: (fn: (progress: ProgressInfo) => void) => void;
    getUpdateDownloaded: (fn: (downloaded: boolean) => void) => void;
    check: () => void;
    download: () => void;
    upgrade: () => void;
  };
}
export type IpcChannel = {
  [K in keyof API & string]: API[K] extends Record<string, unknown> ? `${K}:${keyof API[K] & string}` : never;
}[keyof API & string];
