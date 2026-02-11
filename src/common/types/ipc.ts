import { ProgressInfo } from "electron-updater";
import {
  DeepLProSYGLang,
  DeepLProSYGService,
  DeepLProSYGUsage,
  PronunciationMode,
  Proxy,
  Services,
  Settings,
  Shortcuts,
  YoudaoWebNewService,
  YoudaoWebOldService,
  YoudaoZhiYunService,
} from ".";

export interface Api {
  translate: {
    youdaoWebOld: (data: string) => Promise<YoudaoWebOldService["response"]>;
    youdaoWebNew: (data: string) => Promise<YoudaoWebNewService["response"]>;
    youdaoZhiYun: (data: string) => Promise<YoudaoZhiYunService["response"]>;
    deepLProSYG: (data: string) => Promise<DeepLProSYGService["response"]>;
    deepLProSYGLang: (data: DeepLProSYGLang["request"]) => Promise<DeepLProSYGLang["response"]>;
    deepLProSYGUsage: () => Promise<DeepLProSYGUsage["response"]>;
  };
  setting: {
    getSettings: () => Promise<Settings>;
    setTheme: (theme: string) => Promise<void>;
    setFont: (font: string) => Promise<void>;
    setService: (service: string) => Promise<void>;
    setPronunciationMode: (mode: PronunciationMode) => Promise<void>;
    setResizable: (resize: boolean) => Promise<void>;
    setSilent: (silent: boolean) => Promise<void>;
    setAutoTranslate: (autoTranslate: boolean) => Promise<void>;
    setAutoTranslateDelay: (autoTranslateDelay: number) => Promise<void>;
    setGlobalShortcut: (id: keyof Shortcuts, map: string) => Promise<void>;
    setProxy: (proxy: Proxy) => Promise<void>;
    setServiceConfig: <K extends keyof Services, T extends keyof Services[K]>(service: K, field: T, value: Services[K][T]) => Promise<void>;
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
  [K in keyof Api & string]: Api[K] extends Record<string, unknown> ? `${K}:${keyof Api[K] & string}` : never;
}[keyof Api & string];
