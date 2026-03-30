import { BingService } from "@common/types";
import { useTranslation } from "@renderer/composables";
import { useTranslationStore } from "@renderer/stores";
import { defineComponent, ref } from "vue";
import List from "../base/List";
import AudioBar from "../common/AudioBar";

export default defineComponent(() => {
  const data = ref<BingService["response"] | undefined>();
  const error = ref<boolean>(false);

  useTranslation(() => {
    window.api.translate
      .bing(useTranslationStore().getSourceText())
      .then(res => {
        data.value = res;
        error.value = false;
      })
      .catch(() => (error.value = true));
  });

  const buildAudios = (): { url: string; text: string }[] => {
    if (!data.value?.aus) return [] as { url: string; text: string }[];
    return data.value.aus
      .filter(a => a.audio)
      .map(a => ({ url: a.audio as string, text: `${a.key}${a.phonetic ? ` ${a.phonetic}` : ""}` }));
  };

  const groupDefs = (): { po: string; tr: string[] }[] => {
    if (!data.value?.trs) return [] as { po: string; tr: string[] }[];
    const map = new Map<string, string[]>();
    data.value.trs.forEach(t => {
      const key = t.pos || "";
      const arr = map.get(key) || [];
      if (t.def) arr.push(t.def);
      map.set(key, arr);
    });
    return Array.from(map.entries()).map(([po, tr]) => ({ po, tr }));
  };

  return () => (
    <div class="flex flex-col gap-2 pt-2">
      {error.value ? (
        <div class="text-ctp-red text-center">翻译失败，请重试</div>
      ) : (
        <>
          <AudioBar
            audios={buildAudios()}
            showIcon={true}
          />

          <div class="flex flex-1 flex-col gap-2 overflow-auto">
            {data.value && (
              <>
                {groupDefs().map((g, idx) => (
                  <div
                    class="flex flex-col gap-2"
                    key={idx}>
                    {g.po && <div class="bg-ctp-surface0 text-ctp-peach rounded text-center font-bold">{g.po}</div>}
                    <List list={g.tr} />
                  </div>
                ))}

                {!!data.value.sentences?.length && (
                  <div class="flex flex-col gap-1">
                    {data.value.sentences.map((s, i) => (
                      <div
                        class="rounded p-1"
                        key={i}>
                        <div class="text-ctp-subtext0 text-justify text-sm">{s.eng}</div>
                        <div class="text-ctp-surface2 text-justify text-sm">{s.chs}</div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
});
