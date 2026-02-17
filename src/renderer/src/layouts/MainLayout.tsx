import { useSettingStore } from "@renderer/stores/setting";
import { defineComponent, watch } from "vue";
import { RouterView, useRoute, useRouter } from "vue-router";

export default defineComponent(() => {
  const settingStore = useSettingStore();
  const router = useRouter();
  const route = useRoute();

  window.api.setting.getSettings().then(settings => settingStore.initSettings(settings));
  window.api.window.shown(() => router.replace({ name: settingStore.getService() }));

  watch(
    () => settingStore.font,
    newFont => (document.body.style.fontFamily = newFont),
    { immediate: true },
  );

  addEventListener("keydown", e => {
    if (e.key === "F6") window.api.window.capture();
    if (e.ctrlKey && e.key === "," && route.name !== "setting") router.replace({ name: "setting" });
    if (e.ctrlKey && e.key === "k" && route.name !== "serviceConfig") router.replace({ name: "serviceConfig" });
  });

  return () => (
    <div class={["bg-ctp-base text-ctp-text flex h-screen p-2 *:flex-1", settingStore.theme]}>
      <RouterView />
    </div>
  );
});
