import { YoudaoWebNewService } from "@common/types";
import { useTranslation } from "@renderer/composables";
import { useTranslationStore } from "@renderer/stores";
import { defineComponent, ref } from "vue";
import List from "../base/List";
import AudioBar from "../common/AudioBar";

export default defineComponent(() => {
  const data = ref<YoudaoWebNewService["response"]>();
  const error = ref<boolean>(false);

  useTranslation(() => {
    window.api.translate
      .youdaoWebNew(useTranslationStore().getSourceText())
      .then(res => {
        data.value = res;
        error.value = false;
      })
      .catch(() => (error.value = true));
  });

  return () => (
    <div class="flex flex-col gap-2 pt-2">
      {error.value ? (
        <div class="text-ctp-red text-center">翻译失败，请重试</div>
      ) : (
        <>
          <AudioBar
            audios={data.value?.audio || []}
            showIcon={false}
          />

          <div class="flex flex-1 flex-col gap-2 overflow-auto">
            {/* exam type */}
            {!!data.value?.examType.length && (
              <div class="flex flex-wrap gap-1">
                {data.value?.examType.map(type => (
                  <div class="bg-ctp-mantle text-ctp-lavender rounded px-2 py-1 text-sm">{type}</div>
                ))}
              </div>
            )}

            {/* form */}
            {!!data.value?.form.length && (
              <div class="flex flex-wrap gap-1">
                {data.value?.form.map(f => (
                  <div class="text-ctp-teal bg-ctp-mantle px-2 py-1 text-sm">
                    {f.form} {f.type}
                  </div>
                ))}
              </div>
            )}

            {/* exp */}
            <div class="flex flex-col gap-2">
              {data.value?.exp.map(e => (
                <div class="flex flex-col gap-1">
                  {e.po && <div class="bg-ctp-surface0 text-ctp-peach rounded text-center font-bold">{e.po}</div>}
                  <List list={e.tr} />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
});
