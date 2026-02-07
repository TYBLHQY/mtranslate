import type { YoudaoWebOldService } from "@common/types";
import { fetchWithTimeout } from "@main/utils/network";
import * as cheerio from "cheerio";

const URL = (word: string): string => `https://dict.youdao.com/w/${encodeURIComponent(word)}/`;
const audioURL = (word: string, type: 1 | 2): string =>
  `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(word)}&type=${type}`;

function parse(html: string, word: string): YoudaoWebOldService["response"] {
  const $ = cheerio.load(html);
  const root = $("#phrsListTab");
  const pronounces = root.find(".pronounce");
  const transContainer = root.find(".trans-container");
  const exps = transContainer.find("ul").find("li");
  const additional = transContainer.find(".additional");

  const res: YoudaoWebOldService["response"] = { text: "", audio: [] };
  exps.each((_, el) => !!(res.text += $(el).text() + "\n"));
  res.text += additional.text().replace(/\s\s+/g, " ").trim();
  pronounces.each((_, el) => {
    const text = $(el)
      .contents()
      .filter((_, n) => n.type === "text")
      .text()
      .trim();
    const phonetic = $(el).find(".phonetic").text().trim();
    text.includes("英") && res.audio.push({ text: `${text} ${phonetic}`, url: audioURL(word, 1) });
    text.includes("美") && res.audio.push({ text: `${text} ${phonetic}`, url: audioURL(word, 2) });
  });
  return res;
}

export async function youdaoWebOldService(data: string): Promise<YoudaoWebOldService["response"]> {
  return fetchWithTimeout(URL(data))
    .then(res => res.text())
    .then(text => parse(text, data))
    .catch(error => Promise.reject(error));
}
