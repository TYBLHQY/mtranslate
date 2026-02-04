import { QueryData, YoudaoNewResponse } from "@common/types";
import { useSettingStore } from "@renderer/stores/setting";
import type { PropType, VNode } from "vue";
import { defineComponent, ref, watch } from "vue";
import IconMdiVolume from "~icons/mdi/volume";

export default defineComponent({
  props: {
    query: {
      type: Object as PropType<QueryData>,
      default: null,
    },
  },
  setup(props) {
    const audiosRefs = ref<HTMLAudioElement[]>([]);
    const translateData = ref<YoudaoNewResponse>();
    const settingStore = useSettingStore();

    const translate = async (): Promise<void> => {
      window.api.translate
        .youdaoNew({ ...props.query })
        .then((res: YoudaoNewResponse) => {
          translateData.value = res;
        })
        .catch(err => console.log(err));
    };

    const playAudio = (index: number): void => {
      if (!audiosRefs.value[index]) return;
      audiosRefs.value[index]
        ?.play()
        .catch(() => {
          audiosRefs.value[index].src = `${audiosRefs.value[index].src}&le=zh&product=pc`;
          audiosRefs.value[index]?.play();
        })
        .catch(() => {});
    };

    watch(
      () => props.query,
      () => translate(),
    );

    function renderWithCnParen(text: string): VNode[] {
      const parts = text.split(/(（[^）]*）|〈[^〉]*〉)/g);
      return parts.map(part => {
        if ((part.startsWith("（") && part.endsWith("）")) || (part.startsWith("〈") && part.endsWith("〉")))
          return <span class="text-ctp-overlay1">{part}</span>;
        return <span class="font-bold">{part}</span>;
      });
    }

    return () => (
      <div class="flex flex-col gap-2 overflow-auto">
        {/* audio */}
        {!!translateData.value?.audio.length && (
          <div class="flex flex-wrap gap-2">
            {translateData.value.audio.map((audio, index) => (
              <button
                class="bg-ctp-surface0 hover:bg-ctp-surface1 flex flex-1 items-center justify-center rounded-xs px-2 py-1 text-sm transition-colors"
                onClick={() => {
                  if (settingStore.getPronunciationMode() === "click") playAudio(index);
                }}
                onMouseenter={() => {
                  if (settingStore.getPronunciationMode() === "hover") playAudio(index);
                }}>
                <span>{audio.text || <IconMdiVolume />}</span>
                <audio
                  ref={(el: HTMLAudioElement | null) => (audiosRefs.value[index] = el as HTMLAudioElement)}
                  src={audio.url}
                />
              </button>
            ))}
          </div>
        )}

        {/* exam type */}
        {!!translateData.value?.examType.length && (
          <div class="flex flex-wrap gap-1">
            {translateData.value?.examType.map(type => (
              <div class="bg-ctp-mantle text-ctp-lavender rounded px-2 py-1 text-sm">{type}</div>
            ))}
          </div>
        )}

        {/* form */}
        {!!translateData.value?.form.length && (
          <div class="flex flex-wrap gap-1">
            {translateData.value?.form.map(f => (
              <div class="text-ctp-teal bg-ctp-mantle px-2 py-1 text-sm">
                {f.form} {f.type}
              </div>
            ))}
          </div>
        )}

        {/* exp */}
        <div class="flex flex-col gap-2">
          {translateData.value?.exp.map(e => (
            <div class="flex flex-col gap-1">
              {e.po && <div class="bg-ctp-surface0 text-ctp-peach rounded text-center font-bold">{e.po}</div>}
              <ul>
                {e.tr.map((t, i) => (
                  <li class={["rounded p-1", i % 2 === 0 ? "bg-ctp-mantle" : ""]}>{renderWithCnParen(t)}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
  },
});
