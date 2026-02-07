import { YoudaoWebOldService } from "@common/types";
import { useTranslation } from "@renderer/composables/useTranslation";
import { useTranslationStore } from "@renderer/stores/translation";
import { defineComponent, ref } from "vue";

export default defineComponent({
  setup() {
    const audiosRefs = ref<HTMLAudioElement[]>([]);
    const translateData = ref<YoudaoWebOldService["response"]>();

    useTranslation(() => {
      window.api.translate
        .youdaoWebOld(useTranslationStore().getSourceText())
        .then((res: YoudaoWebOldService["response"]) => {
          translateData.value = res;
        })
        .catch(err => console.log(err));
    });

    return () => (
      <div class="flex flex-col gap-1">
        {translateData.value?.audio && translateData.value.audio.length > 0 && (
          <div class="flex flex-wrap gap-2">
            {translateData.value.audio.map((audio, index) => (
              <button
                key={index}
                class="bg-ctp-surface0 hover:bg-ctp-surface1 flex-1 rounded-xs px-2 py-1 text-sm transition-colors"
                onClick={() => audiosRefs.value[index]?.play()}>
                <span>{audio.text}</span>
                <audio
                  ref={(el: HTMLAudioElement) => (audiosRefs.value[index] = el as HTMLAudioElement)}
                  src={audio.url}
                />
              </button>
            ))}
          </div>
        )}

        <textarea
          class="flex-1 resize-none border-2 border-transparent transition-colors outline-none"
          value={translateData.value?.text || ""}
          placeholder={translateData.value?.text ?? ""}
          readOnly
        />
      </div>
    );
  },
});
