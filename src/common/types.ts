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
export interface Shortcut {
  id: ShortcutId;
  key: string;
  name: string;
}
export interface Settings {
  theme: string;
  font: string;
  silent: boolean;
  resizable: boolean;
  bounds: Electron.Rectangle;
  service: string;
  globalShortcuts: Shortcut[];
}
export const defaultSettings: Settings = {
  theme: "mocha",
  font: "system-ui",
  silent: true,
  resizable: false,
  bounds: { x: 0, y: 0, width: 330, height: 600 },
  service: "youdao-new",
  globalShortcuts: [
    { id: "openAndClose", key: "", name: "打开关闭窗口" },
    { id: "copyText", key: "", name: "翻译选中文本" },
  ],
} as const;

// IPC API
export interface API {
  windowShown: (callback: () => void) => void;
  selectedText: (callback: (text: string) => void) => void;
  translate: {
    youdaoOld: (data: QueryData) => Promise<YoudaoOldResponse>;
    youdaoNew: (data: QueryData) => Promise<YoudaoNewResponse>;
  };
  font: {
    getFonts: () => Promise<string[]>;
  };
  setting: {
    getSettings: () => Promise<Settings>;
    setTheme: (theme: string) => Promise<void>;
    setFont: (font: string) => Promise<void>;
    setService: (service: string) => Promise<void>;
    setResizable: (resize: boolean) => Promise<void>;
    setSilent: (silent: boolean) => Promise<void>;
    setGlobalShortcut: (shortcut: Shortcut) => Promise<void>;
  };
  window: {
    capture: () => Promise<void>;
  };
}
