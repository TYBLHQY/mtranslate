import { useSettingStore } from "@renderer/stores/setting";
import { defineComponent, ref } from "vue";
import IconMdiVolume from "~icons/mdi/volume";

export default defineComponent({
  props: {
    audios: {
      type: Array as () => { url: string; text?: string }[],
      required: true,
    },
  },
  setup(props) {
    const settingStore = useSettingStore();

    const audiosRefs = ref<HTMLAudioElement[]>([]);

    const play = (index: number): void => {
      if (!audiosRefs.value[index]) return;
      audiosRefs.value[index]?.play().catch(() => {
        if (settingStore.getService() === "youdaoWebNew") {
          audiosRefs.value[index].src = `${audiosRefs.value[index].src}&le=zh&product=pc`;
        }
        audiosRefs.value[index]?.play();
      });
    };

    return () =>
      !!props.audios.length && (
        <div class="flex flex-wrap gap-2">
          {props.audios.map((audio, index) => (
            <button
              class="bg-ctp-surface0 hover:bg-ctp-surface1 flex flex-1 items-center justify-center gap-2 rounded-xs px-2 py-1 text-sm transition-colors"
              onClick={() => {
                if (settingStore.getPronunciationMode() === "click") play(index);
              }}
              onMouseenter={() => {
                if (settingStore.getPronunciationMode() === "hover") play(index);
              }}>
              <span>{audio.text}</span>
              <IconMdiVolume />
              <audio
                ref={(el: HTMLAudioElement | null) => (audiosRefs.value[index] = el as HTMLAudioElement)}
                src={audio.url}
              />
            </button>
          ))}
        </div>
      );
  },
});
