import { LanguageCode, languages, Option, QueryData, translateServices } from "@common/types";
import Button from "@renderer/components/common/Button";
import Select from "@renderer/components/common/Select";
import YoudaoNew from "@renderer/components/translations/YoudaoNew";
import YoudaoOld from "@renderer/components/translations/YoudaoOld";
import { useSettingStore } from "@renderer/stores/setting";
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
// import IconMdiContentCopy from "~icons/mdi/content-copy";
import IconMdiSettings from "~icons/mdi/settings";
import IconMdiSwapHorizontal from "~icons/mdi/swap-horizontal";

export default defineComponent({
  setup() {
    const router = useRouter();
    const settingStore = useSettingStore();

    const sourceTextRef = ref<HTMLTextAreaElement>();
    const sourceText = ref("");
    const query = ref<QueryData>();
    const sourceLang = ref<LanguageCode>("zh-CN");
    const targetLang = ref<LanguageCode>("en");

    const handleInput = async (event: KeyboardEvent): Promise<void> => {
      const target = event.target as HTMLTextAreaElement;
      sourceText.value = target.value;
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        handleTranslate();
        sourceTextRef.value?.select();
      }
    };

    const handleTranslate = async (): Promise<void> => {
      if (!sourceText.value.trim()) return;
      query.value = {
        langfrom: sourceLang.value,
        langto: targetLang.value,
        raw: sourceText.value,
      };
    };

    window.api.windowShown(() => {
      sourceTextRef.value?.focus();
    });

    const autoLangRecognition = (): boolean => {
      return settingStore.getService() === "youdao-new" || settingStore.getService() === "youdao-old";
    };

    return () => (
      <div class="flex flex-1 flex-col gap-2 overflow-hidden">
        <div class="flex min-h-0 flex-1">
          <textarea
            class="flex-1 resize-none outline-none"
            ref={sourceTextRef}
            value={sourceText.value}
            onKeydown={(e: KeyboardEvent) => handleInput(e)}
            placeholder="原文"
            autofocus
          />
        </div>

        <div class="bg-ctp-crust">
          {!autoLangRecognition() && (
            <div class="flex items-center justify-center">
              <Select
                value={sourceLang.value}
                options={languages}
                onUpdate:change={(value: Option) => (sourceLang.value = value.code as LanguageCode)}
              />
              <Button
                onClick={() => ([sourceLang.value, targetLang.value] = [targetLang.value, sourceLang.value])}>
                {{ icon: () => <IconMdiSwapHorizontal /> }}
              </Button>
              <Select
                value={targetLang.value}
                options={languages}
                onUpdate:change={(value: Option) => (targetLang.value = value.code as LanguageCode)}
              />
            </div>
          )}
          <div class="flex items-center justify-center">
            <Select
              value={settingStore.getService()}
              options={translateServices}
              onUpdate:change={(value: Option) => settingStore.setService(value.code)}
            />
            <Button onClick={() => router.push({ name: "Settings" })}>
              {{ icon: () => <IconMdiSettings /> }}
            </Button>
            {/* <Button onClick={() => navigator.clipboard.writeText(translatedData.value?.result || "")}>
              {{ icon: () => <IconMdiContentCopy /> }}
            </Button> */}
          </div>
        </div>

        <div class="flex min-h-0 flex-4 *:flex-1">
          {settingStore.getService() === "youdao-new" && <YoudaoNew query={query.value} />}
          {settingStore.getService() === "youdao-old" && <YoudaoOld query={query.value} />}
        </div>
      </div>
    );
  },
});
