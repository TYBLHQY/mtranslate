import { useSettingStore } from "@renderer/stores/setting";
import { defineComponent, watch } from "vue";
import { RouterView, useRouter } from "vue-router";

export default defineComponent({
  setup() {
    const settingStore = useSettingStore();
    const router = useRouter();

    window.api.setting.getSettings().then(settings => settingStore.initSettings(settings));
    window.api.window.shown(() => router.replace({ name: settingStore.getService() }));

    watch(
      () => settingStore.font,
      newFont => (document.body.style.fontFamily = newFont),
      { immediate: true },
    );

    // addEventListener("keydown", e => {
    //   if (e.key === "F6") window.api.window.capture();
    // });

    return () => (
      <div class={["bg-ctp-base text-ctp-text flex h-screen p-2 *:flex-1", settingStore.theme]}>
        <RouterView />
      </div>
    );
  },
});
