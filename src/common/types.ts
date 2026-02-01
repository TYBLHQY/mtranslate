export interface TranslateData {
  langfrom: string;
  langto: string;
  raw: string;
  result?: string;
  audio?: Array<{ text: string; url: string }>;
}

export interface YoudaoResponse {
  result: string;
  audio: Array<{ text: string; url: string }>;
  error?: string;
}

export type TranslateType = "sentence" | "word";

export interface TranslateService {
  id: string;
  type: TranslateType;
  translate: (data: TranslateData) => Promise<void>;
}

export type Languages = {
  "zh-CN": "简体中文";
  "zh-TW": "繁體中文";
  en: "English";
  ja: "日本語";
  ko: "한국어";
  fr: "Français";
  de: "Deutsch";
  es: "Español";
  pt: "Português";
  ru: "Русский";
};
export type LanguageCode = keyof Languages;
export type LanguageName = Languages[LanguageCode];

// IPC 通道
export enum IpcChannel {
  TRANSLATE_YOUDAO = "translate:youdao",
}

// IPC API
export interface API {
  translate: {
    youdao: (data: TranslateData) => Promise<YoudaoResponse>;
  };
  windowShown: (callback: () => void) => void;
}
