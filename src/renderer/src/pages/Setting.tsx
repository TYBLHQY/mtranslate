import { useEsc } from "@renderer/composables/useEsc";
import { useSettingStore } from "@renderer/stores/setting";
import { defineComponent } from "vue";
import { useRouter } from "vue-router";
import IconMdiArrowULeftTop from "~icons/mdi/arrow-u-left-top";

export default defineComponent({
  setup() {
    const router = useRouter();
    const settingStore = useSettingStore();
    useEsc(() => router.push({ name: "Home" }));

    const themeOption = [
      { label: "latte", value: "latte" },
      { label: "mocha", value: "mocha" },
      { label: "frappe", value: "frappe" },
      { label: "macchiato", value: "macchiato" },
    ];

    const handleThemeChange = (value: string): void => {
      settingStore.setTheme(value);
    };

    return () => (
      <div class="flex flex-1 flex-col gap-2 overflow-hidden">
        <button
          class="bg-ctp-crust hover:bg-ctp-surface0 flex cursor-pointer justify-center rounded py-2 transition-colors"
          onClick={() => router.push({ name: "Home" })}>
          <IconMdiArrowULeftTop />
        </button>

        <div class="flex flex-row items-center justify-between gap-2">
          <div>主题色</div>
          <select
            class="bg-ctp-crust hover:bg-ctp-surface0 w-36 cursor-pointer appearance-none rounded py-1 text-center transition-colors outline-none"
            onChange={(e: Event) => handleThemeChange((e.target as HTMLSelectElement).value)}
            value={settingStore.getTheme()}>
            {themeOption.map(option => (
              <option
                class="bg-ctp-crust text-center"
                value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  },
});
