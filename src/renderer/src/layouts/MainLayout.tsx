import { useShortcuts } from "@renderer/composables";
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

  const { registerShortcut } = useShortcuts();

  registerShortcut("F6", () => window.api.window.capture());
  registerShortcut("Ctrl+,", () => {
    if (route.name !== "setting") router.replace({ name: "setting" });
  });
  registerShortcut("Ctrl+k", () => {
    if (route.name !== "serviceConfig") router.replace({ name: "serviceConfig" });
  });

  return () => (
    <div class={["bg-ctp-base text-ctp-text flex h-screen p-2 *:flex-1", settingStore.theme]}>
      <RouterView />
    </div>
  );
});
