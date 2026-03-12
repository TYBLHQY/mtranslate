import { IconMdiKey, IconMdiSettings } from "@renderer/assets";
import { useActiveServices } from "@renderer/composables";
import { useSettingStore } from "@renderer/stores";
import { defineComponent, PropType } from "vue";
import { useRouter } from "vue-router";
import Button from "../base/Button";
import Select from "../base/Select";

export default defineComponent(
  (props: { previewValue?: string }, { attrs }) => {
    const router = useRouter();
    const settingStore = useSettingStore();
    const { activeServiceOptions } = useActiveServices();
    const currentValue = (): string => props.previewValue ?? settingStore.getService();

    return () => (
      <div class="bg-ctp-crust">
        <div class="flex items-center justify-center">
          <Button onClick={() => router.replace({ name: "serviceConfig" })}>
            <IconMdiKey />
          </Button>
          <Select
            class="flex-1"
            value={currentValue()}
            options={activeServiceOptions.value || {}}
            onChange={(value: string) => {
              settingStore.setService(value);
              router.replace({ name: value });
            }}
            {...attrs}
          />
          <Button onClick={() => router.replace({ name: "setting" })}>
            <IconMdiSettings />
          </Button>
        </div>
      </div>
    );
  },
  {
    props: { previewValue: { type: String as PropType<string>, required: false } },
  },
);
