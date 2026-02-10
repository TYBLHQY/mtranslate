import { DeepLProSYGLang, DeepLProSYGService, DeepLProSYGUsage } from "@common/types";
import { getSetting } from "@main/store";
import { fetchWithTimeout, toFormUrlEncoded } from "@main/utils";

const authorization = (authKey: string = "none"): string => `DeepL-Auth-Key ${authKey}`;

export async function deepLProSYGService(data: string): Promise<DeepLProSYGService["response"]> {
  const storeConfig = getSetting("servicesConfig")?.deepLProSYG;
  if (!storeConfig?.state) return Promise.reject(new Error("service is disabled"));

  const config: DeepLProSYGService["request"] = {
    text: data,
    context: storeConfig.contextId ? storeConfig.contexts[storeConfig.contextId].content : "",
    source_lang: storeConfig.sourceLang === "AUTO" ? "" : storeConfig.sourceLang,
    target_lang: storeConfig.targetLang,
    model_type: storeConfig.modelType === "latency_optimized" ? "" : storeConfig.modelType,
    formality: storeConfig.formality,
    tag_handling: storeConfig.tagHandling === "noml" ? "" : storeConfig.tagHandling,
    outline_detection: storeConfig.outlineDetection,
    non_splitting_tags: storeConfig.nonSplittingTags,
    splitting_tags: storeConfig.splittingTags,
    ignore_tags: storeConfig.ignoreTags,
    split_sentences: storeConfig.splitSentences,
    show_billed_characters: storeConfig.showBilledCharacters,
  };

  return fetchWithTimeout("https://api.deepl-pro.com/v2/translate", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: authorization(storeConfig.authKey),
    },
    body: toFormUrlEncoded(config),
  })
    .then(response => response.json())
    .catch(error => Promise.reject(error));
}

// Supported languages
export async function deepLProSYGLang(
  data: DeepLProSYGLang["request"],
): Promise<DeepLProSYGLang["response"]> {
  const storeConfig = getSetting("servicesConfig")?.deepLProSYG;
  if (!storeConfig?.state) return Promise.reject(new Error("service is disabled"));

  return fetchWithTimeout(`https://api.deepl-pro.com/v2/languages?type=${data.type}`, {
    headers: { Authorization: authorization(storeConfig.authKey) },
  })
    .then(response => response.json())
    .catch(error => Promise.reject(error));
}

// Usage information
export async function deepLProSYGUsage(): Promise<DeepLProSYGUsage["response"]> {
  const storeConfig = getSetting("servicesConfig")?.deepLProSYG;
  if (!storeConfig?.state) return Promise.reject(new Error("service is disabled"));

  return fetchWithTimeout("https://api.deepl-pro.com/v2/usage", {
    headers: { Authorization: authorization(storeConfig.authKey) },
  })
    .then(response => response.json())
    .catch(error => Promise.reject(error));
}
