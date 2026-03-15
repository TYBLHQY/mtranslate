import { Services } from ".";

export const serviceOptions = {
  youdaoWebNew: "有道网页 New",
  youdaoWebOld: "有道网页 Old",
  youdaoZhiYun: "有道智云",
  deepLProSYG: "DeepLPro 四译馆",
  freeDictionary: "Free Dictionary",
} as const satisfies Record<keyof Services, string>;
