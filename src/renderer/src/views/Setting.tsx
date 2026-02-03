import { Option } from "@common/types";
import Select from "@renderer/components/common/Select";
import { useEsc } from "@renderer/composables/useEsc";
import { useSettingStore } from "@renderer/stores/setting";
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import IconMdiArrowULeftTop from "~icons/mdi/arrow-u-left-top";

export default defineComponent({
  setup() {
    const router = useRouter();
    const settingStore = useSettingStore();
    useEsc(() => router.push({ name: "Home" }));

    const fontOptions = ref<Option[]>([]);
    const themeOption: Option[] = [
      { code: "latte", name: "latte" },
      { code: "mocha", name: "mocha" },
      { code: "frappe", name: "frappe" },
      { code: "macchiato", name: "macchiato" },
    ];

    window.api.font
      .getFonts()
      .then((fonts: string[]) => (fontOptions.value = fonts.map(font => ({ code: font, name: font }))))
      .finally(() => fontOptions.value.unshift({ code: "system-ui", name: "System Default" }));

    return () => (
      <div class="flex flex-1 flex-col gap-2 overflow-hidden">
        <button
          class="bg-ctp-crust hover:bg-ctp-surface0 flex cursor-pointer justify-center rounded py-2 transition-colors"
          onClick={() => router.push({ name: "Home" })}>
          <IconMdiArrowULeftTop />
        </button>

        <div class="flex flex-row items-center justify-between gap-2">
          <div>主题</div>
          <Select
            options={themeOption}
            value={settingStore.getTheme()}
            onUpdate:change={(value: Option) => settingStore.setTheme(value.code)}
          />
        </div>

        <div class="flex flex-row items-center justify-between gap-2">
          <div>字体</div>
          <Select
            options={fontOptions.value}
            value={settingStore.getFont()}
            onUpdate:change={(value: Option) => settingStore.setFont(value.code)}
          />
        </div>
      </div>
    );
  },
});
