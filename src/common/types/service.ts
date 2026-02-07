import { ServicesConfig } from ".";

export const serviceOptions = {
  youdaoWebNew: "有道网页 New",
  youdaoWebOld: "有道网页 Old",
  youdaoZhiYun: "有道智云",
} as const satisfies Record<keyof ServicesConfig, string>;
