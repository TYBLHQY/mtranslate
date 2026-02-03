import { QueryData, YoudaoOldResponse } from "@common/types";
import type { PropType } from "vue";
import { defineComponent, ref, watch } from "vue";

export default defineComponent({
  props: {
    query: {
      type: Object as PropType<QueryData>,
      default: null,
    },
  },
  setup(props) {
    const audiosRefs = ref<HTMLAudioElement[]>([]);
    const translateData = ref<YoudaoOldResponse>();

    const translate = async (): Promise<void> => {
      window.api.translate
        .youdaoOld({ ...props.query })
        .then((res: YoudaoOldResponse) => {
          translateData.value = res;
        })
        .catch(err => console.log(err));
    };

    watch(
      () => props.query,
      () => translate(),
    );

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
                  ref={(el: HTMLAudioElement | null) => (audiosRefs.value[index] = el as HTMLAudioElement)}
                  src={audio.url}
                />
              </button>
            ))}
          </div>
        )}

        <textarea
          class="flex-1 resize-none border-2 border-transparent transition-colors outline-none"
          value={translateData.value?.text || ""}
          placeholder={translateData.value?.text ? "" : "译文"}
          readOnly
        />
      </div>
    );
  },
});
