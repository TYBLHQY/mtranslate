// import { DeepLProSiYiGuanService } from "@common/types/services/deepLProSiYiGuan";
// import { getSetting } from "@main/store";
// import { net } from "electron";

// export async function deepLProSiYiGuanService(data: string): Promise<DeepLProSiYiGuanService["response"]> {
//   // const storeSetting = getSetting("servicesConfig")?.deepLProSiYiGuan;
//   // if (!storeSetting?.state) return Promise.reject(new Error("DeepL 四译馆 服务未启用"));

//   // const params = new URLSearchParams({
//   //   context: storeSetting.contexts[storeSetting.contextId] ?? "",
//   //   source_lang: storeSetting.sourceLang,
//   //   target_lang: storeSetting.targetLang,
//   //   model_type: storeSetting.modelType,
//   //   formality: storeSetting.formality,
//   //   tag_handling: storeSetting.tagHandling,
//   //   split_sentences: storeSetting.splitSentences,
//   //   show_billed_characters: storeSetting.showBilledCharacters.toString(),
//   // });
//   // data.forEach(text => params.append("text", text));

//   const params = new URLSearchParams({
//     text: data,
//     context: "",
//     source_lang: "ZH",
//     target_lang: "EN-US",
//     model_type: "prefer_quality_optimized",
//     formality: "default",
//     tag_handling: "xml",
//     split_sentences: "1",
//     show_billed_characters: "true",
//   });
//   console.log("DeepL 四译馆 request params:", params.toString());

//   return net
//     .fetch("https://api.deepl-pro.com/v2/translate", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//         Authorization: `DeepL-Auth-Key 207a5b19-8a4e-4d46-b661-5155fc2ef7f6:dp`,
//         // Authorization: `DeepL-Auth-Key ${storeSetting?.authKey}`,
//       },
//       body: params.toString(),
//     })
//     .then(response => response.json())
//     .then(json => {
//       console.log("DeepL 四译馆 response:", json);
//       // Handle the response JSON as needed
//       return json;
//     })
//     .catch(error => {
//       console.error("DeepL 四译馆 error:", error);
//       return Promise.reject(error);
//     });
// }

// // Supported languages
// export async function deepLProSiYiGuanLang(
//   data: DeepLProSiYiGuanLang["request"],
// ): Promise<DeepLProSiYiGuanLang["response"]> {
//   return net
//     .fetch("https://api.deepl-pro.com/v2/languages?type=target", {
//       method: "GET",
//       headers: {
//         Authorization: "DeepL-Auth-Key 207a5b19-8a4e-4d46-b661-5155fc2ef7f6:dp",
//       },
//     })
//     .then(response => response.json())
//     .then(json => {
//       console.log("DeepL 四译馆 languages response:", json);
//       // Handle the response JSON as needed
//       return json;
//     })
//     .catch(error => {
//       console.error("DeepL 四译馆 languages error:", error);
//       return Promise.reject(error);
//     });
// }

// // Usage information
// export async function deepLProSiYiGuanUsage(): Promise<DeepLProSiYiGuanUsage["response"]> {
//   return net
//     .fetch("https://api.deepl-pro.com/v2/usage", {
//       method: "GET",
//       headers: {
//         Authorization: "DeepL-Auth-Key 207a5b19-8a4e-4d46-b661-5155fc2ef7f6:dp",
//       },
//     })
//     .then(response => response.json())
//     .then(json => {
//       console.log("DeepL 四译馆 usage response:", json);
//       // Handle the response JSON as needed
//       return json;
//     })
//     .catch(error => {
//       console.error("DeepL 四译馆 usage error:", error);
//       return Promise.reject(error);
//     });
// }
