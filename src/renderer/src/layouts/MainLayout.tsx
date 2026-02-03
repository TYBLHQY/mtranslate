import { useSettingStore } from "@renderer/stores/setting";
import { defineComponent, onMounted, watch } from "vue";
import { RouterView } from "vue-router";

export default defineComponent({
  setup() {
    const settingStore = useSettingStore();

    onMounted(() => {
      window.api.setting.getSettings().then(settings => settingStore.initSettings(settings));
    });

    watch(
      () => settingStore.font,
      newFont => (document.body.style.fontFamily = newFont),
    );

    return () => (
      <div class={["bg-ctp-base text-ctp-text flex h-screen p-2", settingStore.theme]}>
        <RouterView />
      </div>
    );
  },
});
