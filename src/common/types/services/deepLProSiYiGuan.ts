export const deepLProSiYiGuanOption = {
  errorCode: {
    "301": "请使用https，而不是http，接口域名地址前得加https://",
    "400": "请求参数有误。响应会提供附加信息，其中包含有关错误的更多详细信息。",
    "403":
      "未授权。没有检测到正确的密钥，如果没注册，则到deepl-pro.com注册获取密钥；如果注册了，检查密钥是否正确。",
    "404": "请求地址不正确。检查请求地址是否正确，如翻译接口地址是 https://api.deepl-pro.com/v2/translate",
    "413":
      "请求体过大。请求正文的总大小不得超过 128 KiB（128 - 1024 字节），如果超过此限制，请将文本分成多次调用。",
    "429": "请求过多。建议延迟一段时间后重新发送请求，而不是不断地重新发送请求。",
    "456": "超出配额。已达到您账户的翻译限额，请考虑购买字符量。",
    "500": "未知错误，如果遇到重新尝试请求一次，如果问题依旧，请联系我们。",
    "502": "DeepL服务临时出现故障，如遇到重新尝试请求一次，如果问题依旧，请联系我们。",
    "503":
      "DeepL官方服务因为更新/维护暂时不可以。建议延迟一段时间后重新发送请求，而不是不断地重新发送请求。如果错误持续很长时间，请联系我们。",
  },
  modelType: {
    latency_optimized: "经典（速度）",
    quality_optimized: "下一代（质量）",
    prefer_quality_optimized: "优先下一代（质量）",
  },
  formality: {
    default: "默认",
    more: "更正式",
    less: "更非正式",
    prefer_more: "优先更正式",
    prefer_less: "优先更非正式",
  },
  tagHandling: {
    xml: "XML",
    html: "HTML",
  },
  splitSentences: {
    nonewlines: "不换行分句（处理XML/HTML时推荐）",
    "1": "默认分句",
    "0": "不分句",
  },
} as const satisfies Record<string, Record<string, string>>;

export interface DeepLProSiYiGuanService {
  request: {
    text: string;
    context: string;
    source_lang: string;
    target_lang: string;
    model_type: keyof typeof deepLProSiYiGuanOption.modelType;
    formality: keyof typeof deepLProSiYiGuanOption.formality;
    tag_handling: keyof typeof deepLProSiYiGuanOption.tagHandling;
    split_sentences: keyof typeof deepLProSiYiGuanOption.splitSentences;
    show_billed_characters: boolean;
  };
  response: {
    translations: Array<{
      detected_source_language: string;
      text: string;
      billed_characters?: number;
    }>;
  };
}

export interface DeepLProSiYiGuanLang {
  request: {
    type?: "source" | "target";
  };
  response: Array<{
    language: string;
    name: string;
    supports_formality?: boolean;
  }>;
}

export interface DeepLProSiYiGuanUsage {
  response: {
    character_count: number;
    character_limit: number;
  };
}
