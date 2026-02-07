import Button from "@renderer/components/base/Button";
import Select from "@renderer/components/base/Select";
import { useActiveServices } from "@renderer/composables/useActiveService";
import { useSettingStore } from "@renderer/stores/setting";
import { defineComponent } from "vue";
import { useRouter } from "vue-router";

import IconMdiKey from "~icons/mdi/key";
import IconMdiSettings from "~icons/mdi/settings";

export default defineComponent({
  setup() {
    const router = useRouter();
    const settingStore = useSettingStore();
    const { activeServiceOptions } = useActiveServices();

    return () => (
      <div class="bg-ctp-crust">
        <div class="flex items-center justify-center">
          <Button onClick={() => router.replace({ name: "serviceConfig" })}>
            <IconMdiKey />
          </Button>
          <Select
            class="flex-1"
            value={settingStore.getService()}
            options={activeServiceOptions.value || {}}
            onUpdate:change={(value: string) => {
              settingStore.setService(value);
              router.replace({ name: value });
            }}
          />
          <Button onClick={() => router.replace({ name: "setting" })}>
            <IconMdiSettings />
          </Button>
        </div>
      </div>
    );
  },
});
