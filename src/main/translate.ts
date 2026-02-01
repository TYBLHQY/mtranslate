import { IpcChannel, TranslateData, YoudaoResponse } from "@common/types";
import { ipcMain } from "electron";

const wordURL = (word: string): string => `https://dict.youdao.com/w/${encodeURIComponent(word)}/`;
const audioURL = (word: string, type: 1 | 2): string =>
  `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(word)}&type=${type}`;

export function setupTranslateHandlers(): void {
  ipcMain.handle(IpcChannel.TRANSLATE_YOUDAO, async (_, data: TranslateData) => {
    return youdaoTranslate(data);
  });
}

async function youdaoTranslate(data: TranslateData): Promise<YoudaoResponse> {
  const url = wordURL(data.raw);
  return fetch(url, { method: "GET" })
    .then(res => res.text())
    .then(text => extractAudioAndTranslation(text, data.raw))
    .catch(error => Promise.reject(error));
}

function extractAudioAndTranslation(text: string, word: string): YoudaoResponse {
  const match = text
    .replace(/(\r\n|\n|\r)/gm, "")
    .match(/<div id="phrsListTab.*webTrans" class="trans-wrapper trans-tab">/gm);
  const content =
    match && match.length > 0
      ? match[0]
          .replace(/<[^>]*>?/gm, "\n")
          .replace(/\n\s*\n/g, "\n")
          .replace(/\s\s+/g, " ")
          .trim()
      : "";
  const res: YoudaoResponse = { result: content, audio: [] };
  if (content.length !== 0) {
    const en = content.match(/英\s*\[[^\]]+\]/m);
    en != null && res.audio.push({ text: en[0], url: audioURL(word, 1) });
    const us = content.match(/美\s*\[[^\]]+\]/m);
    us != null && res.audio.push({ text: us[0], url: audioURL(word, 2) });
  }
  res.result = parseAndFormatResult(content, res.audio.length);
  return res;
}

function parseAndFormatResult(rawText: string, audioCount: number): string {
  if (!rawText || rawText.trim() === "" || rawText === "无释义") return "无释义";
  const lines = rawText.split("\n").filter(line => line.trim());
  if (lines.length === 0) return "无释义";
  const contentLines = lines.slice(audioCount + 1);
  const formatted = contentLines.map(line => line.trim());
  return formatted.join("\n");
}
