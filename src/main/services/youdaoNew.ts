import { QueryData, YoudaoNewResponse } from "@common/types";
import { fetchWithTimeout } from "@main/utils/network";
import * as cheerio from "cheerio";

const URL = (word: string, lang: string): string =>
  `https://dict.youdao.com/result?word=${word}&lang=${lang}`;
// const audioURL = (word: string, type: 1 | 2, longMode: boolean = false): string =>
//   `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(word)}&type=${type}${longMode ? "&le=zh&product=pc" : ""}`;
const audioURL = (word: string, type: 1 | 2): string =>
  `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(word)}&type=${type}`;

export async function parse(html: string, word: string): Promise<YoudaoNewResponse> {
  const $ = cheerio.load(html);
  const root = $(".modules");
  const audioRoot = root.find(".simple-explain");
  const textRoot = root.find("#catalogue_author").find(".dict-book");

  const res: YoudaoNewResponse = { exp: [], examType: [], audio: [], form: [] };

  // audios
  if (audioRoot.find(".lj-title").length > 0 && audioRoot.find(".pronounce").length > 0) {
    // 长句
    res.audio.push({ text: "", url: audioURL(word, 2) });
  } else if (audioRoot.find(".per-phone").length > 0) {
    // 单词
    audioRoot.find(".per-phone").each((i, el) => {
      res.audio.push({ text: $(el).text().trim(), url: audioURL(word, i === 0 ? 1 : 2) });
    });
  } else {
    // 短句
    res.audio.push({ text: "", url: audioURL(word, 2) });
  }

  // exps
  const simple = textRoot.find(".simple");
  const fanyi = textRoot.find(".fanyi");
  if (simple.length > 0) {
    // 简明
    if (simple.find(".word-exp-ce").length > 0) {
      // zh
      simple.find(".word-exp-ce").each((_, el) => {
        const $el = $(el);
        const po = $el.find(".trans-ce").find(".point").text().trim();
        let tr = $el.find(".word-exp_tran").text().trim();
        if (tr.endsWith("；")) tr = tr.substring(0, tr.length - 1);
        res.exp.push({ po, tr: tr.split("；") });
      });
    } else if (simple.find(".word-exp").length > 0) {
      // en
      simple.find(".word-exp").each((_, el) => {
        const $el = $(el);
        let po = $el.find(".pos").text().trim();
        let tr = $el.find(".trans").text().trim();
        if (tr.startsWith("【名】")) {
          po = "名";
          tr = tr.substring(3);
        }
        // 替换 <> 为〈〉
        tr = tr.replace(/</g, "〈").replace(/>/g, "〉");
        res.exp.push({ po, tr: tr.split("；") });
      });

      // examTypes
      simple
        .find(".exam_type")
        .find(".exam_type-value")
        .each((_, el) => {
          res.examType.push($(el).text().trim());
        });

      // forms
      simple
        .find(".word-wfs-less")
        .find(".word-wfs-cell-less")
        .each((_, el) => {
          const $el = $(el);
          const form = $el.find(".transformation").text().trim();
          const type = $el.find(".grey").find(".wfs-name").text().trim();
          res.form.push({ form, type });
        });
    }
  } else if (fanyi.length > 0) {
    // 翻译
    if (fanyi.find(".trans-content").length > 0) {
      const text = fanyi.find(".trans-content").text().trim();
      res.exp.push({ po: "", tr: [text] });
    }
  }

  return res;
}

export async function transYoudaoNewService(data: QueryData): Promise<YoudaoNewResponse> {
  return fetchWithTimeout(URL(data.raw, data.langto), { method: "GET" })
    .then(res => res.text())
    .then(text => parse(text, data.raw))
    .catch(error => Promise.reject(error));
}
