import { youdaoZhiYunErrorCodes, youdaoZhiYunLangSupport, YoudaoZhiYunService } from "@common/types";
import { useTranslation } from "@renderer/composables";
import { useSettingStore, useTranslationStore } from "@renderer/stores";
import { defineComponent, ref } from "vue";
import List from "../base/List";
import AudioBar from "../common/AudioBar";
import LanguageBar from "../common/LanguageBar";

export default defineComponent(() => {
  const settingStore = useSettingStore();

  const data = ref<YoudaoZhiYunService["response"]>();

  useTranslation(() => {
    window.api.translate.youdaoZhiYun(useTranslationStore().getSourceText()).then(res => {
      data.value = res;
      settingStore.getServicesConfig().youdaoZhiYun.wrapLine &&
        (data.value.translation = data.value.translation.flatMap(l => l.split(/\r?\n/)).filter(Boolean));
    });
  });

  return () => (
    <div class="flex flex-col gap-2">
      <LanguageBar
        changeButton={true}
        sourceLang={settingStore.getServicesConfig().youdaoZhiYun.from}
        targetLang={settingStore.getServicesConfig().youdaoZhiYun.to}
        sourceSupport={youdaoZhiYunLangSupport}
        targetSupport={youdaoZhiYunLangSupport}
        onUpdateSource={(value: keyof typeof youdaoZhiYunLangSupport) => settingStore.setServiceConfig("youdaoZhiYun", "from", value)}
        onUpdateTarget={(value: keyof typeof youdaoZhiYunLangSupport) => settingStore.setServiceConfig("youdaoZhiYun", "to", value)}
        onUpdateExchange={() => {
          const [currentSource, currentTarget] = [
            settingStore.getServicesConfig().youdaoZhiYun.from,
            settingStore.getServicesConfig().youdaoZhiYun.to,
          ];
          settingStore.setServiceConfig("youdaoZhiYun", "from", currentTarget);
          settingStore.setServiceConfig("youdaoZhiYun", "to", currentSource);
        }}
      />
      {data.value && data.value.errorCode !== "0" ? (
        <div class="text-ctp-red text-center">
          {data.value?.errorCode}: {youdaoZhiYunErrorCodes[data.value?.errorCode || ""] || "未知错误"}
        </div>
      ) : data.value ? (
        <>
          <AudioBar
            audios={[
              { url: data.value.speakUrl, text: "原文" },
              { url: data.value.tSpeakUrl, text: "译文" },
            ]}
          />
          <div class="flex flex-col gap-2">
            <List list={data.value?.translation || []} />
          </div>
        </>
      ) : null}
    </div>
  );
});
