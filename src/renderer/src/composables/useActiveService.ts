import { serviceOptions } from "@common/types";
import { useSettingStore } from "@renderer/stores/setting";
import { computed, ComputedRef, watch } from "vue";
import { useRouter } from "vue-router";

export function useActiveServices(): {
  activeServiceOptions: ComputedRef;
} {
  const router = useRouter();
  const settingStore = useSettingStore();

  const activeServiceOptions = computed(() =>
    Object.fromEntries(
      Object.entries(serviceOptions).filter(([key]) => settingStore.getServicesConfig()[key]?.state),
    ),
  );

  function syncActiveService(): void {
    const options = activeServiceOptions.value;
    if (!options) return;

    const current = settingStore.getService();
    if (options[current]) {
      router.replace({ name: current });
      return;
    }

    const first = Object.keys(options)[0];
    if (!first) return;

    settingStore.setService(first);
    router.replace({ name: first });
  }

  watch(activeServiceOptions, syncActiveService, { immediate: true });

  return {
    activeServiceOptions,
  };
}
