import { defaultSettings, YoudaoZhiYunService } from "@common/types";
import { getSetting } from "@main/store";
import { sha256 } from "@main/utils/crypto";

// https://ai.youdao.com/DOCSIRMA/html/trans/api/wbfy/index.html

const input = (q: string): string => {
  if (q.length <= 20) return q;
  return q.substring(0, 10) + q.length + q.substring(q.length - 10);
};
const URL = (params: YoudaoZhiYunService["request"]): string => {
  const searchParams = new URLSearchParams(
    Object.entries(params)
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => [k, String(v)]),
  );
  return `https://openapi.youdao.com/api?${searchParams.toString()}`;
};

export async function youdaoZhiYunService(data: string): Promise<YoudaoZhiYunService["response"]> {
  const storeConfig = getSetting("servicesConfig")?.youdaoZhiYun;
  const curtime = Math.floor(Date.now() / 1000).toString();
  const salt = Date.now().toString();
  const config: YoudaoZhiYunService["request"] = {
    ...defaultSettings.servicesConfig.youdaoZhiYun,
    ...storeConfig,
    q: data,
    curtime,
    salt,
    sign: sha256(storeConfig?.appKey + input(data) + salt + curtime + storeConfig?.apiSecret),
    signType: "v3",
  };

  return fetch(URL(config))
    .then(res => res.json())
    .catch(error => Promise.reject(error));
}
