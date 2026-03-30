import { FreeDictionaryService, LanguageWithWords } from "@common/types";
import { useTranslation } from "@renderer/composables";
import { useSettingStore, useTranslationStore } from "@renderer/stores";
import { defineComponent, onMounted, ref } from "vue";
import Tag from "../base/Tag";
import LanguageBar from "../common/LanguageBar";

export default defineComponent(() => {
  const translateData = ref<FreeDictionaryService["response"] | null>(null);
  const languages = ref<Record<string, string>>({ all: "All" });
  const settingStore = useSettingStore();
  const selectedLanguage = ref(settingStore.getServicesConfig().freeDictionary.language || "all");

  onMounted(() => {
    window.api.translate
      .freeDictionaryLanguages()
      .then((list: LanguageWithWords[]) => {
        const map: Record<string, string> = { all: "All" };
        list.forEach(l => {
          if (l?.code && l?.name) map[l.code] = l.name;
        });
        languages.value = map;
      })
      .catch(() => {
        languages.value = { all: "All" };
      });
  });

  useTranslation(() => {
    const text = useTranslationStore().getSourceText();
    if (!text) return;
    window.api.translate
      .freeDictionary({ language: selectedLanguage.value || "all", word: text, translations: true, pretty: false })
      .then((res: FreeDictionaryService["response"]) => {
        translateData.value = res;
      })
      .catch(() => (translateData.value = null));
  });

  return () => (
    <div class="flex flex-col gap-2 overflow-auto pt-2">
      <LanguageBar
        changeButton={false}
        sourceLang={""}
        targetLang={selectedLanguage.value}
        sourceSupport={{}}
        targetSupport={languages.value}
        onUpdateTarget={value => {
          selectedLanguage.value = value;
          settingStore.setServiceConfig("freeDictionary", "language", value);
          const text = useTranslationStore().getSourceText();
          if (!text) return;
          window.api.translate
            .freeDictionary({ language: selectedLanguage.value || "all", word: text, translations: true, pretty: false })
            .then((res: FreeDictionaryService["response"]) => {
              translateData.value = res;
            })
            .catch(() => (translateData.value = null));
        }}
      />

      {translateData.value ? (
        <div class="flex flex-col gap-2">
          {translateData.value.entries.map((entry, i) => (
            <div
              key={i}
              class="bg-ctp-base rounded-md p-2 shadow-sm">
              <div class="mb-2 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="text-lg font-medium">{entry.language?.name || entry.language?.code}</div>
                  <Tag class="text-sm">{entry.partOfSpeech}</Tag>
                </div>
              </div>

              {entry.pronunciations && entry.pronunciations.length > 0 && (
                <div class="my-2 flex flex-wrap gap-1">
                  {entry.pronunciations.map(p => (
                    <div class="bg-ctp-mantle text-ctp-sapphire rounded px-2 py-1 text-sm">
                      {p.type}: {p.text}
                    </div>
                  ))}
                </div>
              )}

              {entry.forms && entry.forms.length > 0 && (
                <div class="my-2 flex flex-wrap gap-1">
                  {entry.forms.map(f => (
                    <div class="bg-ctp-mantle text-ctp-lavender rounded px-2 py-1 text-sm">{f.word}</div>
                  ))}
                </div>
              )}

              {entry.senses && entry.senses.length > 0 && (
                <div class="space-y-2">
                  {entry.senses.map((s, idx) => (
                    <div key={idx}>
                      <div class="text-ctp-subtle text-justify">{s.definition}</div>
                      {s.examples && s.examples.length > 0 && (
                        <div class="my-2 flex flex-col gap-1">
                          {s.examples.map((ex, exIdx) => (
                            <div
                              key={exIdx}
                              class="bg-ctp-mantle text-ctp-sapphire rounded px-2 py-1 text-sm">
                              {ex}
                            </div>
                          ))}
                        </div>
                      )}
                      {s.synonyms && s.synonyms.length > 0 && (
                        <div class="my-2 flex flex-wrap gap-1">
                          <div class="py-1 text-sm">近</div>
                          {s.synonyms.map(syn => (
                            <div class="bg-ctp-mantle text-ctp-teal rounded px-2 py-1 text-sm">{syn}</div>
                          ))}
                        </div>
                      )}
                      {s.antonyms && s.antonyms.length > 0 && (
                        <div class="my-2 flex flex-wrap gap-1">
                          <div class="py-1 text-sm">反</div>
                          {s.antonyms.map(ant => (
                            <div class="bg-ctp-mantle text-ctp-maroon rounded px-2 py-1 text-sm">{ant}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div class="flex flex-1 items-center justify-center">
          <div class="text-muted">Loading...</div>
        </div>
      )}
    </div>
  );
});
