import { BingService } from "@common/types/services/bing";
import { fetchWithTimeout } from "@main/utils";
import * as cheerio from "cheerio";

const HOST = "https://www.bing.com";
const URL = (word: string): string => `${HOST}/dict/search?q=${encodeURIComponent(word)}&FORM=BDVSP6&cc=cn`;

export async function bingDictService(text: string): Promise<BingService["response"]> {
  const url = URL(text);
  const resText = await fetchWithTimeout(url, { credentials: "include" });
  const html = await resText.text();
  const $ = cheerio.load(html);

  const word = $("#headword > h1").text().trim();
  if (!word) {
    return Promise.reject(new Error("no word found"));
  }

  const trs: Array<{ pos?: string; def?: string }> = [];
  $("div.qdef > ul > li").each((_, el) => {
    const pos = $(el).find(".pos").text().trim() || undefined;
    const def = $(el).find(".def").text().trim() || undefined;
    trs.push({ pos, def });
  });

  const presents: string[] = [];
  $("div.hd_div1>.hd_if>.p1-5").each((_, el) => {
    const present = $(el).text().trim();
    if (present) presents.push(present);
  });

  const ecs: Array<{ pos?: string; lis: string[] }> = [];
  $(".each_seg>.li_pos").each((_, el) => {
    const pos = $(el).find(".pos_lin>.pos").text().trim() || undefined;
    const lis: string[] = [];
    $(el)
      .find(".de_seg>.se_lis")
      .each((_, li) => {
        const v = $(li).find(".de_co").text().trim();
        if (v) lis.push(v);
      });
    ecs.push({ pos, lis });
  });

  const sentences: Array<{ eng: string; chs: string }> = [];
  $("#sentenceSeg .se_li").each((_, el) => {
    const eng = $(el).find(".sen_en").text().trim();
    const chs = $(el).find(".sen_cn").text().trim();
    if (eng && chs) sentences.push({ eng, chs });
  });

  const aus: Array<{ key: string; audio?: string; phonetic?: string }> = [];
  const $audioUK = $("#bigaud_uk");
  const $audioUS = $("#bigaud_us");

  if ($audioUK.length > 0) {
    const mp3 = $audioUK.attr("data-mp3link") || "";
    const audioUK = mp3 ? HOST + mp3 : undefined;
    const $phoneticUK = $audioUK.parent().prev();
    const phoneticUK = $phoneticUK
      .text()
      .trim()
      .match(/\[(.*?)\]/)?.[1];
    aus.push({ key: "英", audio: audioUK, phonetic: phoneticUK });
  }

  if ($audioUS.length > 0) {
    const mp3 = $audioUS.attr("data-mp3link") || "";
    const audioUS = mp3 ? HOST + mp3 : undefined;
    const $phoneticUS = $audioUS.parent().prev();
    const phoneticUS = $phoneticUS
      .text()
      .trim()
      .match(/\[(.*?)\]/)?.[1];
    aus.push({ key: "美", audio: audioUS, phonetic: phoneticUS });
  }

  // fallback phonetics if no audio elements
  if (aus.length === 0) {
    const $pronInfo = $(".hd_pr");
    const $pronInfoUS = $(".hd_prUS");

    if ($pronInfo.length > 0) {
      const phoneticText = $pronInfo.text().trim();
      const match = phoneticText.match(/\[([^\]]+)\]/);
      if (match) aus.push({ key: "英", phonetic: match[1] });
    }

    if ($pronInfoUS.length > 0) {
      const phoneticText = $pronInfoUS.text().trim();
      const match = phoneticText.match(/\[([^\]]+)\]/);
      if (match) aus.push({ key: "美", phonetic: match[1] });
    }
  }

  const result: BingService["response"] = { word, trs, aus, ecs, sentences, presents };
  return result;
}

export default bingDictService;
