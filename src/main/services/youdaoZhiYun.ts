import { defaultSettings, YoudaoZhiYunService } from "@common/types";
import { getSetting } from "@main/store";
import { sha256, toFormUrlEncoded } from "@main/utils";

// https://ai.youdao.com/DOCSIRMA/html/trans/api/wbfy/index.html

const input = (q: string): string => {
  if (q.length <= 20) return q;
  return q.substring(0, 10) + q.length + q.substring(q.length - 10);
};

export async function youdaoZhiYunService(data: string): Promise<YoudaoZhiYunService["response"]> {
  const storeConfig = getSetting("servicesConfig")?.youdaoZhiYun;
  if (!storeConfig?.state) return Promise.reject(new Error("serveice is disabled"));

  const curtime = Math.floor(Date.now() / 1000).toString();
  const salt = Date.now().toString();
  const config: YoudaoZhiYunService["request"] = {
    ...defaultSettings.servicesConfig.youdaoZhiYun,
    ...storeConfig,
    q: data,
    curtime,
    salt,
    sign: sha256(storeConfig.appKey + input(data) + salt + curtime + storeConfig.apiSecret),
    signType: "v3",
  };

  return fetch(`https://openapi.youdao.com/api?${toFormUrlEncoded(config)}`)
    .then(res => res.json())
    .catch(error => Promise.reject(error));
}
