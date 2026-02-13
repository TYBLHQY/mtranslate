import { IconMdiKey, IconMdiSettings } from "@renderer/assets";
import { useActiveServices } from "@renderer/composables";
import { useSettingStore } from "@renderer/stores";
import { defineComponent } from "vue";
import { useRouter } from "vue-router";
import Button from "../base/Button";
import Select from "../base/Select";

export default defineComponent(() => {
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
          onChange={(value: string) => {
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
});
