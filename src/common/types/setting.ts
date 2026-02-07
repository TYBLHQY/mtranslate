import { youdaoZhiYunDomains, youdaoZhiYunLangSupport } from "./services/youdaoZhiYun";

export type PronunciationMode = "hover" | "click";

export const themeOptions = {
  latte: "latte",
  mocha: "mocha",
  frappe: "frappe",
  macchiato: "macchiato",
} as const;

export const shortcuts = {
  openAndClose: "开关窗口",
  copyText: "划词翻译",
} as const satisfies Record<string, string>;

export interface Shortcut {
  id: keyof typeof shortcuts;
  key: string;
}

export interface Proxy extends Electron.ProxyConfig {
  url: string;
  port: number;
  username: string;
  password: string;
  pacScript: string;
  proxyBypassRules: string;
}

export interface ServicesConfig {
  youdaoWebNew: {
    state: boolean;
  };
  youdaoWebOld: {
    state: boolean;
  };
  youdaoZhiYun: {
    state: boolean;
    from: keyof typeof youdaoZhiYunLangSupport;
    to: keyof typeof youdaoZhiYunLangSupport;
    appKey: string;
    apiSecret: string;
    voice: 0 | 1;
    strict: boolean;
    vocabId: string;
    domain: keyof typeof youdaoZhiYunDomains;
    rejectFallback: boolean;
  };
}

export interface Settings {
  // version
  appVersion: string;
  dbVersion: number;

  // appearance
  theme: keyof typeof themeOptions;
  font: string;
  silent: boolean;
  resizable: boolean;
  bounds: Electron.Rectangle;

  // service
  service: string;
  pronunciationMode: PronunciationMode;
  servicesConfig: ServicesConfig;

  // shortcuts
  globalShortcuts: Shortcut[];

  // proxy
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
  service: "youdaoWebNew",
  pronunciationMode: "click",
  globalShortcuts: [
    { id: "openAndClose", key: "" },
    { id: "copyText", key: "" },
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
  servicesConfig: {
    youdaoWebNew: {
      state: true,
    },
    youdaoWebOld: {
      state: false,
    },
    youdaoZhiYun: {
      state: false,
      from: "auto",
      to: "zh-CHS",
      appKey: "",
      apiSecret: "",
      voice: 0,
      strict: false,
      vocabId: "",
      domain: "general",
      rejectFallback: false,
    },
  },
} as const;
