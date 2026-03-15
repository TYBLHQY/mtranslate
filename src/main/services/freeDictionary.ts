import { FreeDictionaryLanguages, FreeDictionaryService } from "@common/types";
import { fetchWithTimeout } from "@main/utils";

const base = (language: string, word: string, translations?: boolean, pretty?: boolean): string => {
  const lang = encodeURIComponent(language || "all");
  const w = encodeURIComponent(word);
  const qs = `translations=${translations ? "true" : "false"}&pretty=${pretty ? "true" : "false"}`;
  return `https://freedictionaryapi.com/api/v1/entries/${lang}/${w}?${qs}`;
};

export async function freeDictionaryService(data: FreeDictionaryService["request"]): Promise<FreeDictionaryService["response"]> {
  return fetchWithTimeout(base(data.language || "all", data.word, data.translations, data.pretty))
    .then(res => res.json())
    .catch(error => Promise.reject(error));
}

export async function freeDictionaryLanguages(): Promise<FreeDictionaryLanguages["response"]> {
  return fetchWithTimeout("https://freedictionaryapi.com/api/v1/languages")
    .then(res => res.json())
    .catch(error => Promise.reject(error));
}
