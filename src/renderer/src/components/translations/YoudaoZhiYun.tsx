import { youdaoZhiYunErrorCodes, YoudaoZhiYunService } from "@common/types";
import { useTranslation } from "@renderer/composables/useTranslation";
import { useTranslationStore } from "@renderer/stores/translation";
import { defineComponent, ref } from "vue";
import List from "../base/List";
import AudioBar from "../common/AudioBar";

export default defineComponent({
  setup() {
    const data = ref<YoudaoZhiYunService["response"]>();

    useTranslation(() => {
      window.api.translate.youdaoZhiYun(useTranslationStore().getSourceText()).then(res => {
        data.value = res;
        data.value.translation = data.value.translation.flatMap(l => l.split(/\r?\n/)).filter(Boolean);
      });
    });

    return () =>
      data.value && data.value.errorCode !== "0" ? (
        <div class="text-ctp-red text-center">
          {data.value?.errorCode}: {youdaoZhiYunErrorCodes[data.value?.errorCode || ""] || "未知错误"}
        </div>
      ) : (
        <div class="flex flex-col gap-2">
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
        </div>
      );
  },
});
