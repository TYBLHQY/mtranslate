import { DeepLProSYGService, deepLProSYGSourceSupport, deepLProSYGTargetSupport, DeepLProSYGUsage } from "@common/types";
import { LanguageBar } from "@renderer/components";
import { useTranslation } from "@renderer/composables";
import { useSettingStore, useTranslationStore } from "@renderer/stores";
import { computed, defineComponent, ref } from "vue";

export default defineComponent(() => {
  const settingStore = useSettingStore();

  const data = ref<DeepLProSYGService["response"]>();
  const usage = ref<DeepLProSYGUsage["response"]>();

  const updateUsage = (): void => {
    window.api.translate.deepLProSYGUsage().then(res => (usage.value = res));
  };

  useTranslation(() => {
    const lang = settingStore.getServicesConfig().deepLProSYG.targetLang;
    settingStore.getServicesConfig().deepLProSYG.formality !== "default" &&
      !deepLProSYGTargetSupport[lang].supportsFormality &&
      settingStore.setServiceConfig("deepLProSYG", "targetLang", "DE");
    window.api.translate.deepLProSYG(useTranslationStore().getSourceText()).then(res => {
      data.value = res;
      updateUsage();
    });
  });

  const targetSupport = computed(() => {
    const formality = settingStore.getServicesConfig().deepLProSYG.formality !== "default";
    return Object.fromEntries(
      Object.entries(deepLProSYGTargetSupport)
        .filter(([, info]) => !formality || info.supportsFormality)
        .map(([code, info]) => [code, info.name]),
    );
  });

  updateUsage();

  return () => (
    <div class="flex flex-col gap-2">
      <LanguageBar
        changeButton={false}
        sourceLang={settingStore.getServicesConfig().deepLProSYG.sourceLang}
        targetLang={settingStore.getServicesConfig().deepLProSYG.targetLang}
        sourceSupport={deepLProSYGSourceSupport}
        targetSupport={targetSupport.value}
        onUpdateSource={value => settingStore.setServiceConfig("deepLProSYG", "sourceLang", value)}
        onUpdateTarget={value => settingStore.setServiceConfig("deepLProSYG", "targetLang", value)}
        onUpdateExchange={() => {
          const [currentSource, currentTarget] = [
            settingStore.getServicesConfig().deepLProSYG.sourceLang,
            settingStore.getServicesConfig().deepLProSYG.targetLang,
          ];
          settingStore.setServiceConfig("deepLProSYG", "sourceLang", currentTarget as keyof typeof deepLProSYGSourceSupport);
          settingStore.setServiceConfig("deepLProSYG", "targetLang", currentSource as keyof typeof deepLProSYGTargetSupport);
        }}
      />
      {data.value && (
        <div class="flex flex-col gap-2">
          <div class="bg-ctp-surface0 rounded p-1 text-center">
            本周期：{usage.value?.character_count}/{usage.value?.character_limit}
          </div>
          <ul>
            {data.value.translations.map((t, i) => (
              <li class={["rounded p-1", i % 2 === 0 ? "bg-ctp-mantle" : ""]}>
                <div class="whitespace-pre-line">{t.text}</div>
                {settingStore.getServicesConfig().deepLProSYG.showBilledCharacters && (
                  <div class="text-ctp-overlay0 text-end text-sm">消耗：{t.billed_characters}</div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
});
