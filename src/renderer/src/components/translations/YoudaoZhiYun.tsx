import { youdaoZhiYunErrorCodes, youdaoZhiYunLangSupport, YoudaoZhiYunService } from "@common/types";
import { useTranslation } from "@renderer/composables/useTranslation";
import { useSettingStore } from "@renderer/stores/setting";
import { useTranslationStore } from "@renderer/stores/translation";
import { defineComponent, ref } from "vue";
import List from "../base/List";
import AudioBar from "../common/AudioBar";
import LanguageBar from "../common/LanguageBar";

export default defineComponent({
  setup() {
    const data = ref<YoudaoZhiYunService["response"]>();
    const settingStore = useSettingStore();

    useTranslation(() => {
      window.api.translate.youdaoZhiYun(useTranslationStore().getSourceText()).then(res => {
        data.value = res;
        // data.value.translation = data.value.translation.flatMap(l => l.split(/\r?\n/)).filter(Boolean);
      });
    });

    return () => (
      <div class="flex flex-col gap-2">
        <LanguageBar
          sourceLang={settingStore.getServicesConfig().youdaoZhiYun.from || ""}
          targetLang={settingStore.getServicesConfig().youdaoZhiYun.to || ""}
          langSupport={youdaoZhiYunLangSupport}
          onUpdate:changeSource={(value: keyof typeof youdaoZhiYunLangSupport) =>
            settingStore.setServiceConfig("youdaoZhiYun", { from: value })
          }
          onUpdate:changeTarget={(value: keyof typeof youdaoZhiYunLangSupport) =>
            settingStore.setServiceConfig("youdaoZhiYun", { to: value })
          }
          onUpdate:exchange={() => {
            const [currentSource, currentTarget] = [
              settingStore.getServicesConfig().youdaoZhiYun.from || "",
              settingStore.getServicesConfig().youdaoZhiYun.to || "",
            ];
            settingStore.setServiceConfig("youdaoZhiYun", { from: currentTarget, to: currentSource });
          }}
        />
        {data.value && data.value.errorCode !== "0" ? (
          <div class="text-ctp-red text-center">
            {data.value?.errorCode}: {youdaoZhiYunErrorCodes[data.value?.errorCode || ""] || "未知错误"}
          </div>
        ) : (
          <>
            <AudioBar
              audios={[
                {
                  url: data.value?.speakUrl || "",
                  text: "原文",
                },
                {
                  url: data.value?.tSpeakUrl || "",
                  text: "译文",
                },
              ]}
            />
            <div class="flex flex-col gap-2">
              <List list={data.value?.translation || []} />
            </div>
          </>
        )}
      </div>
    );
  },
});
