import { useSettingStore } from "@renderer/stores/setting";
import { defineComponent, KeepAlive, watch } from "vue";
import { RouterView, useRouter } from "vue-router";

export default defineComponent({
  setup() {
    const settingStore = useSettingStore();
    const router = useRouter();

    window.api.setting.getSettings().then(settings => settingStore.initSettings(settings));
    window.api.window.shown(() => router.push({ name: "Home" }));

    watch(
      () => settingStore.font,
      newFont => (document.body.style.fontFamily = newFont),
    );

    // addEventListener("keydown", e => {
    //   if (e.key === "F6") window.api.window.capture();
    // });

    return () => (
      <div class={["bg-ctp-base text-ctp-text flex h-screen p-2", settingStore.theme]}>
        <RouterView>
          {{
            default: ({ Component }) => (
              <KeepAlive>
                <Component />
              </KeepAlive>
            ),
          }}
        </RouterView>
      </div>
    );
  },
});
