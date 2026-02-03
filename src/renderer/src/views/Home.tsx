import { LanguageCode, languages, Option, QueryData, translateServices } from "@common/types";
import Button from "@renderer/components/common/Button";
import Select from "@renderer/components/common/Select";
import YoudaoNew from "@renderer/components/translations/YoudaoNew";
import YoudaoOld from "@renderer/components/translations/YoudaoOld";
import { useSettingStore } from "@renderer/stores/setting";
import { useTranslationStore } from "@renderer/stores/translation";
import { defineComponent, onActivated, ref } from "vue";
import { useRouter } from "vue-router";
import IconMdiSettings from "~icons/mdi/settings";
import IconMdiSwapHorizontal from "~icons/mdi/swap-horizontal";

export default defineComponent({
  setup() {
    const router = useRouter();
    const settingStore = useSettingStore();
    const translationStore = useTranslationStore();

    const sourceTextRef = ref<HTMLTextAreaElement>();
    const query = ref<QueryData>();
    const sourceLang = ref<LanguageCode>("zh-CN");
    const targetLang = ref<LanguageCode>("en");

    const focusInput = (): void => {
      sourceTextRef.value?.focus();
      sourceTextRef.value?.select();
    };

    const handleInput = async (event: KeyboardEvent): Promise<void> => {
      translationStore.setSourceText((event.target as HTMLTextAreaElement).value);
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        handleTranslate();
        focusInput();
      }
      if (event.key === "Escape") {
        event.preventDefault();
        focusInput();
      }
    };

    const handleTranslate = async (): Promise<void> => {
      if (!translationStore.getSourceText()) return;
      query.value = {
        langfrom: sourceLang.value,
        langto: targetLang.value,
        raw: translationStore.getSourceText(),
      };
      focusInput();
    };

    const autoLangRecognition = (): boolean => {
      return settingStore.getService() === "youdao-new" || settingStore.getService() === "youdao-old";
    };

    window.api.selectedText((text: string) => {
      useTranslationStore().setSourceText(text);
      handleTranslate();
    });
    window.api.windowShown(() => focusInput());
    onActivated(() => focusInput());

    return () => (
      <div class="flex flex-1 flex-col gap-2 overflow-hidden">
        <div class="flex min-h-0 flex-1">
          <textarea
            class="flex-1 resize-none outline-none"
            ref={sourceTextRef}
            value={translationStore.getSourceText()}
            onKeydown={(e: KeyboardEvent) => handleInput(e)}
            placeholder="原文"
          />
        </div>

        <div class="bg-ctp-crust">
          {!autoLangRecognition() && (
            <div class="flex items-center justify-center">
              <Select
                class="flex-1"
                value={sourceLang.value}
                options={languages}
                onUpdate:change={(value: Option) => (sourceLang.value = value.code as LanguageCode)}
              />
              <Button
                onClick={() => ([sourceLang.value, targetLang.value] = [targetLang.value, sourceLang.value])}>
                {{ icon: () => <IconMdiSwapHorizontal /> }}
              </Button>
              <Select
                class="flex-1"
                value={targetLang.value}
                options={languages}
                onUpdate:change={(value: Option) => (targetLang.value = value.code as LanguageCode)}
              />
            </div>
          )}
          <div class="flex items-center justify-center">
            <Select
              class="flex-1"
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
