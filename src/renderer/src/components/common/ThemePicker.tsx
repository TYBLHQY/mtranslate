import { themeOptions } from "@common/types";
import { useSettingStore } from "@renderer/stores/setting";
import { computed, defineComponent, onMounted, onUnmounted, ref } from "vue";

export default defineComponent(() => {
  const settingStore = useSettingStore();
  const visible = ref(false);
  const selectedIndex = ref(0);

  const themes = computed(() => {
    const recent = settingStore.getRecentThemes();
    // ensure we have unique list and all known themes present
    const all = Object.keys(themeOptions) as Array<keyof typeof themeOptions>;
    const list: Array<keyof typeof themeOptions> = [];
    for (const t of recent) if (all.includes(t) && !list.includes(t)) list.push(t);
    for (const t of all) if (!list.includes(t)) list.push(t);
    return list;
  });

  const handleKeyDown = (e: KeyboardEvent): void => {
    if (e.key.toLowerCase() !== "t") return;
    if (!e.ctrlKey) return;
    e.preventDefault();
    e.stopPropagation();

    if (!visible.value) {
      visible.value = true;
      // on first open, select second theme if available, otherwise use current theme
      if (themes.value.length > 1) selectedIndex.value = 1;
      else {
        selectedIndex.value = themes.value.indexOf(settingStore.getTheme() as keyof typeof themeOptions);
        if (selectedIndex.value < 0) selectedIndex.value = 0;
      }
      return;
    }

    // cycle down
    selectedIndex.value = (selectedIndex.value + 1) % themes.value.length;
  };

  const handleKeyUp = (e: KeyboardEvent): void => {
    // when ctrl released -> apply selected
    if (e.key === "Control" || e.key === "Meta") {
      if (visible.value) {
        const theme = themes.value[selectedIndex.value];
        settingStore.setTheme(theme);
        visible.value = false;
      }
    }
  };

  onMounted(() => {
    window.addEventListener("keydown", handleKeyDown, true);
    window.addEventListener("keyup", handleKeyUp, true);
  });
  onUnmounted(() => {
    window.removeEventListener("keydown", handleKeyDown, true);
    window.removeEventListener("keyup", handleKeyUp, true);
  });

  return () => (
    <>
      {visible.value ? (
        <div class="pointer-events-none fixed inset-0 z-50 flex items-center justify-center">
          <div class="pointer-events-auto absolute inset-0" />
          <div class="bg-ctp-base border-ctp-blue pointer-events-auto relative z-10 w-56 rounded border-2 p-2 shadow">
            <ul>
              {themes.value.map((t, i) => (
                <li
                  key={t}
                  class={[
                    "cursor-pointer rounded p-2",
                    i === selectedIndex.value ? "bg-ctp-overlay2 text-ctp-crust" : "hover:bg-ctp-overlay0 hover:text-ctp-base",
                  ]}
                  onClick={() => {
                    settingStore.setTheme(t);
                    visible.value = false;
                  }}>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </>
  );
});
