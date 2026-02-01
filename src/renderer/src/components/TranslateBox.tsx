import type { LanguageCode, LanguageName, Languages, TranslateData, YoudaoResponse } from "@common/types";
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import IconMdiContentCopy from "~icons/mdi/content-copy";
import IconMdiSettings from "~icons/mdi/settings";
import IconMdiSwapHorizontal from "~icons/mdi/swap-horizontal";

export default defineComponent({
  setup() {
    const router = useRouter();
    const sourceTextRef = ref<HTMLTextAreaElement | null>(null);
    const sourceText = ref("");

    const audiosRefs = ref<HTMLAudioElement[]>([]);
    const translatedData = ref<TranslateData | null>(null);

    const sourceLang = ref<LanguageCode>("zh-CN");
    const targetLang = ref<LanguageCode>("en");
    const isLoading = ref(false);

    const languages: Languages = {
      "zh-CN": "简体中文",
      "zh-TW": "繁體中文",
      en: "English",
      ja: "日本語",
      ko: "한국어",
      fr: "Français",
      de: "Deutsch",
      es: "Español",
      pt: "Português",
      ru: "Русский",
    } as const;

    const languageOptions = Object.entries(languages).map(([code, name]) => ({
      code: code as LanguageCode,
      name: name as LanguageName,
    }));

    const handleInput = async (event: KeyboardEvent): Promise<void> => {
      const target = event.target as HTMLTextAreaElement;
      sourceText.value = target.value;
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        handleTranslate();
        await new Promise(resolve => setTimeout(resolve, 100));
        sourceTextRef.value?.select();
      }
    };

    const handleTranslate = async (): Promise<void> => {
      if (!sourceText.value.trim()) return;
      isLoading.value = true;

      const data: TranslateData = {
        langfrom: sourceLang.value,
        langto: targetLang.value,
        raw: sourceText.value,
      };
      window.api.translate
        .youdao(data)
        .then((res: YoudaoResponse) => {
          translatedData.value = { ...data, result: res?.result, audio: res?.audio };
        })
        .catch(() => (translatedData.value = null))
        .finally(() => (isLoading.value = false));
    };

    // const copyToClipboard = async (text: string): Promise<void> => {
    //   navigator.clipboard.writeText(text);
    //   if (!sourceTextarea.value) return;
    //   sourceTextarea.value.focus();
    //   sourceTextarea.value.select();
    // };

    window.api.windowShown(() => {
      sourceTextRef.value?.focus();
    });

    return () => (
      <div class="flex flex-1 flex-col gap-2 overflow-hidden">
        {/* Source Section */}
        <textarea
          ref={sourceTextRef}
          class="flex-1 resize-none outline-none"
          value={sourceText.value}
          onKeydown={(e: KeyboardEvent) => handleInput(e)}
          placeholder="原文"
          autofocus
        />

        {/* Control Buttons */}
        <div class="bg-ctp-crust flex items-center justify-center gap-1 rounded-xs px-1">
          <button
            class="hover:text-ctp-overlay0 cursor-pointer px-1 transition-colors outline-none"
            onClick={() => router.push("/settings")}>
            <IconMdiSettings />
          </button>
          <select
            class="hover:bg-ctp-surface0 flex-1 appearance-none rounded-xs p-1 text-center transition-colors outline-none"
            value={sourceLang.value}
            // 隐藏下拉箭头
            onChange={(e: Event) =>
              (sourceLang.value = (e.target as HTMLSelectElement).value as LanguageCode)
            }>
            {languageOptions.map(opt => (
              <option
                class="bg-ctp-crust text-center"
                key={opt.code}
                value={opt.code}>
                {opt.name}
              </option>
            ))}
          </select>
          <button
            class="hover:text-ctp-overlay0 cursor-pointer px-1 transition-colors outline-none"
            onClick={() => {
              const temp = sourceLang.value;
              sourceLang.value = targetLang.value;
              targetLang.value = temp;
            }}>
            <IconMdiSwapHorizontal />
          </button>
          <select
            class="hover:bg-ctp-surface0 flex-1 appearance-none rounded-xs p-1 text-center transition-colors outline-none"
            value={targetLang.value}
            onChange={(e: Event) =>
              (targetLang.value = (e.target as HTMLSelectElement).value as LanguageCode)
            }>
            {languageOptions.map(opt => (
              <option
                class="bg-ctp-crust text-center"
                key={opt.code}
                value={opt.code}>
                {opt.name}
              </option>
            ))}
          </select>
          <button
            class="hover:text-ctp-overlay0 cursor-pointer px-1 transition-colors outline-none"
            onClick={() => navigator.clipboard.writeText(translatedData.value?.result || "")}>
            <IconMdiContentCopy />
          </button>
        </div>

        <div class="flex flex-2 flex-col gap-1">
          {translatedData.value?.audio && translatedData.value.audio.length > 0 && (
            <div class="flex flex-wrap gap-2">
              {translatedData.value.audio.map((audio, index) => (
                <button
                  key={index}
                  class="bg-ctp-surface0 hover:bg-ctp-surface1 flex-1 rounded-xs px-2 py-1 text-sm transition-colors"
                  onClick={() => audiosRefs.value[index]?.play()}>
                  {audio.text}
                  <audio
                    ref={(el: HTMLAudioElement | null) => (audiosRefs.value[index] = el as HTMLAudioElement)}
                    src={audio.url}
                  />
                </button>
              ))}
            </div>
          )}

          {/* Target Section */}
          <textarea
            class="flex-1 resize-none border-2 border-transparent transition-colors outline-none"
            value={translatedData.value?.result || ""}
            placeholder={isLoading.value ? "翻译中..." : translatedData.value?.result ? "" : "译文"}
            readOnly
          />
        </div>
      </div>
    );
  },
});
