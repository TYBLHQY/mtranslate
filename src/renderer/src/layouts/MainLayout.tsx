import { useSettingStore } from "@renderer/stores/setting";
import { defineComponent } from "vue";
import { RouterView } from "vue-router";

export default defineComponent({
  name: "MainLayout",
  setup() {
    const settingStore = useSettingStore();

    return () => (
      <div class={["bg-ctp-base text-ctp-text flex h-screen p-2", settingStore.getTheme()]}>
        <RouterView />
      </div>
    );
  },
});
