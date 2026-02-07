import { Ref, ref } from "vue";

export function useFont(): { fontOptions: Ref<Record<string, string>> } {
  const fontOptions = ref<Record<string, string>>({});

  window.api.window
    .getFonts()
    .then(
      (fonts: string[]) => (fontOptions.value = fonts.reduce((acc, font) => ({ ...acc, [font]: font }), {})),
    )
    .finally(() => (fontOptions.value["system-ui"] = "System Default"));

  return { fontOptions };
}
