import { UUID } from "crypto";
import {
  deepLProSYGOption,
  deepLProSYGSourceSupport,
  deepLProSYGTargetSupport,
  shortcutOptions,
  themeOptions,
  youdaoZhiYunDomains,
  youdaoZhiYunLangSupport,
} from ".";

export type PronunciationMode = "hover" | "click";

export type Shortcuts = {
  [K in keyof typeof shortcutOptions]: string;
};

export interface Proxy extends Electron.ProxyConfig {
  url: string;
  port: number;
  username: string;
  password: string;
  pacScript: string;
  proxyBypassRules: string;
}

export interface Services {
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
    wrapLine: boolean;
  };
  deepLProSYG: {
    state: boolean;
    contextId: UUID | "";
    contexts: Record<UUID, { title: string; content: string }>;
    authKey: string;
    sourceLang: keyof typeof deepLProSYGSourceSupport;
    targetLang: keyof typeof deepLProSYGTargetSupport;
    modelType: keyof typeof deepLProSYGOption.modelType;
    formality: keyof typeof deepLProSYGOption.formality;
    tagHandling: keyof typeof deepLProSYGOption.tagHandling;
    outlineDetection: boolean;
    nonSplittingTags: string[];
    splittingTags: string[];
    ignoreTags: string;
    splitSentences: keyof typeof deepLProSYGOption.splitSentences;
    showBilledCharacters: boolean;
  };
  freeDictionary: {
    state: boolean;
    language: string;
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
  autoTranslate: boolean;
  autoTranslateDelay: number;

  // service
  service: string;
  pronunciationMode: PronunciationMode;
  servicesConfig: Services;

  // shortcuts
  globalShortcuts: Shortcuts;

  // window toggle behavior: when toggling main window, if it's already shown,
  // either focus when unfocused or always hide regardless of focus
  windowToggleBehavior: "focus-if-shown" | "hide-if-shown";

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
  autoTranslate: false,
  autoTranslateDelay: 500,
  service: "youdaoWebNew",
  pronunciationMode: "click",
  globalShortcuts: {
    openAndClose: "",
    copyText: "",
  },
  windowToggleBehavior: "focus-if-shown",
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
      wrapLine: true,
    },
    deepLProSYG: {
      state: false,
      contextId: "",
      contexts: {},
      authKey: "",
      sourceLang: "ZH",
      targetLang: "EN-US",
      modelType: "prefer_quality_optimized",
      formality: "default",
      tagHandling: "noml",
      outlineDetection: false,
      nonSplittingTags: [],
      splittingTags: [],
      ignoreTags: "",
      splitSentences: "1",
      showBilledCharacters: true,
    },
    freeDictionary: {
      state: false,
      language: "all",
    },
  },
} as const;
