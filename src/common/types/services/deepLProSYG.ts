export const deepLProSYGSourceSupport = {
  AUTO: "AUTO",
  EN: "英语",
  ZH: "中文",
  AR: "阿拉伯语",
  BG: "保加利亚语",
  CS: "捷克语",
  DA: "丹麦语",
  DE: "德语",
  EL: "希腊语",
  ES: "西班牙语",
  ET: "爱沙尼亚语",
  FI: "芬兰语",
  FR: "法语",
  HE: "希伯来语",
  HU: "匈牙利语",
  ID: "印尼语",
  IT: "意大利语",
  JA: "日语",
  KO: "韩语",
  LT: "立陶宛语",
  LV: "拉脱维亚语",
  NB: "挪威语",
  NL: "荷兰语",
  PL: "波兰语",
  PT: "葡萄牙语",
  RO: "罗马尼亚语",
  RU: "俄语",
  SK: "斯洛伐克语",
  SL: "斯洛文尼亚语",
  SV: "瑞典语",
  TH: "泰语",
  TR: "土耳其语",
  UK: "乌克兰语",
  VI: "越南语",
} as const satisfies Record<string, string>;

export const deepLProSYGTargetSupport = {
  ZH: { name: "中文", supportsFormality: false },
  "ZH-HANS": { name: "中文（简体）", supportsFormality: false },
  "ZH-HANT": { name: "中文（繁体）", supportsFormality: false },
  "EN-GB": { name: "英语（英国）", supportsFormality: false },
  "EN-US": { name: "英语（美国）", supportsFormality: false },
  JA: { name: "日语", supportsFormality: true },
  KO: { name: "韩语", supportsFormality: false },
  AR: { name: "阿拉伯语", supportsFormality: false },
  BG: { name: "保加利亚语", supportsFormality: false },
  CS: { name: "捷克语", supportsFormality: false },
  DA: { name: "丹麦语", supportsFormality: false },
  DE: { name: "德语", supportsFormality: true },
  EL: { name: "希腊语", supportsFormality: false },
  ES: { name: "西班牙语", supportsFormality: true },
  "ES-419": { name: "西班牙语（拉丁美洲）", supportsFormality: true },
  ET: { name: "爱沙尼亚语", supportsFormality: false },
  FI: { name: "芬兰语", supportsFormality: false },
  FR: { name: "法语", supportsFormality: true },
  HE: { name: "希伯来语", supportsFormality: false },
  HU: { name: "匈牙利语", supportsFormality: false },
  ID: { name: "印尼语", supportsFormality: false },
  IT: { name: "意大利语", supportsFormality: true },
  LT: { name: "立陶宛语", supportsFormality: false },
  LV: { name: "拉脱维亚语", supportsFormality: false },
  NB: { name: "挪威语", supportsFormality: false },
  NL: { name: "荷兰语", supportsFormality: true },
  PL: { name: "波兰语", supportsFormality: true },
  "PT-BR": { name: "葡萄牙语（巴西）", supportsFormality: true },
  "PT-PT": { name: "葡萄牙语（欧洲）", supportsFormality: true },
  RO: { name: "罗马尼亚语", supportsFormality: false },
  RU: { name: "俄语", supportsFormality: true },
  SK: { name: "斯洛伐克语", supportsFormality: false },
  SL: { name: "斯洛文尼亚语", supportsFormality: false },
  SV: { name: "瑞典语", supportsFormality: false },
  TH: { name: "泰语", supportsFormality: false },
  TR: { name: "土耳其语", supportsFormality: false },
  UK: { name: "乌克兰语", supportsFormality: false },
  VI: { name: "越南语", supportsFormality: false },
} as const satisfies Record<string, { name: string; supportsFormality: boolean }>;

export const deepLProSYGOption = {
  errorCode: {
    "301": "请使用https，而不是http，接口域名地址前得加https://",
    "400": "请求参数有误。响应会提供附加信息，其中包含有关错误的更多详细信息。",
    "403": "未授权。没有检测到正确的密钥，如果没注册，则到deepl-pro.com注册获取密钥；如果注册了，检查密钥是否正确。",
    "404": "请求地址不正确。检查请求地址是否正确，如翻译接口地址是 https://api.deepl-pro.com/v2/translate",
    "413": "请求体过大。请求正文的总大小不得超过 128 KiB（128 - 1024 字节），如果超过此限制，请将文本分成多次调用。",
    "429": "请求过多。建议延迟一段时间后重新发送请求，而不是不断地重新发送请求。",
    "456": "超出配额。已达到您账户的翻译限额，请考虑购买字符量。",
    "500": "未知错误，如果遇到重新尝试请求一次，如果问题依旧，请联系我们。",
    "502": "DeepL服务临时出现故障，如遇到重新尝试请求一次，如果问题依旧，请联系我们。",
    "503":
      "DeepL官方服务因为更新/维护暂时不可以。建议延迟一段时间后重新发送请求，而不是不断地重新发送请求。如果错误持续很长时间，请联系我们。",
  },
  modelType: {
    latency_optimized: "经典（快速）",
    quality_optimized: "下一代（质量）",
    prefer_quality_optimized: "优先下一代",
  },
  formality: {
    default: "默认",
    more: "更正式",
    less: "更非正式",
    prefer_more: "优先更正式",
    prefer_less: "优先更非正式",
  },
  tagHandling: {
    noml: "不处理",
    xml: "XML",
    html: "HTML",
  },
  splitSentences: {
    nonewlines: "不换行（处理标签推荐）",
    "1": "标点和换行分割",
    "0": "不分句",
  },
} as const satisfies Record<string, Record<string, string>>;

export interface DeepLProSYGService {
  request: {
    text: string;
    context: string;
    source_lang: string;
    target_lang: string;
    model_type: keyof typeof deepLProSYGOption.modelType | "";
    formality: keyof typeof deepLProSYGOption.formality;
    tag_handling: keyof typeof deepLProSYGOption.tagHandling | "";
    outline_detection: boolean;
    non_splitting_tags: string[];
    splitting_tags: string[];
    ignore_tags: string;
    split_sentences: keyof typeof deepLProSYGOption.splitSentences;
    show_billed_characters: boolean;
  };
  response: {
    translations: Array<{
      detected_source_language: string;
      text: string;
      billed_characters?: number;
    }>;
    message?: string;
  };
}

export interface DeepLProSYGLang {
  request: {
    type: "source" | "target";
  };
  response: Array<{
    language: string;
    name: string;
    supports_formality?: boolean;
  }>;
}

export interface DeepLProSYGUsage {
  response: {
    character_count: number;
    character_limit: number;
  };
}
