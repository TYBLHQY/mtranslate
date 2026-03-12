import { OptionBar, SourceInput } from "@renderer/components";

import { useActiveServices } from "@renderer/composables";
import { useShortcuts } from "@renderer/composables/useShortcuts";
import { useSettingStore } from "@renderer/stores";
import { computed, defineComponent, onMounted, onUnmounted, ref } from "vue";
import { RouterView, useRouter } from "vue-router";

export default defineComponent(() => {
  const router = useRouter();
  const settingStore = useSettingStore();
  const { activeServiceOptions } = useActiveServices();

  const options = computed(() => Object.keys(activeServiceOptions.value || {}));

  const previewService = ref<string | null>(null);

  const { registerShortcut } = useShortcuts();
  const unregisters: Array<() => void> = [];

  const pickNext = (): void => {
    const arr = options.value;
    if (!arr.length) return;
    const current = previewService.value ?? settingStore.getService();
    let idx = arr.indexOf(current);
    if (idx === -1) idx = 0;
    idx = (idx + 1) % arr.length;
    previewService.value = arr[idx];
  };

  const pickPrev = (): void => {
    const arr = options.value;
    if (!arr.length) return;
    const current = previewService.value ?? settingStore.getService();
    let idx = arr.indexOf(current);
    if (idx === -1) idx = 0;
    idx = (idx - 1 + arr.length) % arr.length;
    previewService.value = arr[idx];
  };

  onMounted(() => {
    unregisters.push(
      registerShortcut("Alt+j", e => {
        e.preventDefault();
        pickNext();
      }),
    );
    unregisters.push(
      registerShortcut("Alt+k", e => {
        e.preventDefault();
        pickPrev();
      }),
    );

    const onKeyUp = (e: KeyboardEvent): void => {
      if (e.key === "Alt") {
        if (previewService.value && previewService.value !== settingStore.getService()) {
          settingStore.setService(previewService.value);
          router.replace({ name: previewService.value });
        }
        previewService.value = null;
      }
    };

    window.addEventListener("keyup", onKeyUp);
    unregisters.push(() => window.removeEventListener("keyup", onKeyUp));
  });

  onUnmounted(() => {
    while (unregisters.length) {
      const u = unregisters.shift();
      if (u) u();
    }
  });

  return () => (
    <div class="flex flex-col overflow-hidden">
      <SourceInput class="pb-2" />
      <OptionBar previewValue={previewService.value ?? undefined} />
      <div class="flex min-h-0 flex-4 *:flex-1">
        <RouterView />
      </div>
    </div>
  );
});
