import { Option } from "@common/types";
import Button from "@renderer/components/common/Button";
import Select from "@renderer/components/common/Select";
import { useEsc } from "@renderer/composables/useEsc";
import { useSettingStore } from "@renderer/stores/setting";
import { defineComponent, ref, VNode } from "vue";
import { useRouter } from "vue-router";
import IconMdiLock from "~icons/mdi/lock";
import IconMdiLockOpenVariant from "~icons/mdi/lock-open-variant";
import IconMdiTransitionMasked from "~icons/mdi/transition-masked";

export default defineComponent({
  setup() {
    const router = useRouter();
    const settingStore = useSettingStore();
    useEsc(() => router.push({ name: "Home" }));

    const fontOptions = ref<Option[]>([]);
    const themeOption: Option[] = [
      { code: "latte", name: "latte" },
      { code: "mocha", name: "mocha" },
      { code: "frappe", name: "frappe" },
      { code: "macchiato", name: "macchiato" },
    ];

    window.api.font
      .getFonts()
      .then((fonts: string[]) => (fontOptions.value = fonts.map(font => ({ code: font, name: font }))))
      .finally(() => fontOptions.value.unshift({ code: "system-ui", name: "System Default" }));

    const settingItem = (name: VNode, content: VNode): VNode => (
      <div class="flex flex-row items-center justify-between gap-2">
        {name}
        {content}
      </div>
    );

    return () => (
      <div class="flex flex-1 flex-col gap-2 overflow-hidden">
        <Button onClick={() => router.push({ name: "Home" })}>
          {{ icon: () => <IconMdiTransitionMasked class="text-ctp-mauve" /> }}
        </Button>

        {settingItem(
          <div>主题</div>,
          <Select
            class="flex-1"
            options={themeOption}
            value={settingStore.getTheme()}
            onUpdate:change={(value: Option) => settingStore.setTheme(value.code)}
          />,
        )}

        {settingItem(
          <div>字体</div>,
          <Select
            class="flex-1"
            options={fontOptions.value}
            value={settingStore.getFont()}
            onUpdate:change={(value: Option) => settingStore.setFont(value.code)}
          />,
        )}

        {settingItem(
          <div>窗口大小</div>,
          <Button
            class="flex-1"
            onClick={() => settingStore.setResizable(!settingStore.getResizable())}>
            {
              [<IconMdiLockOpenVariant class="text-ctp-green" />, <IconMdiLock class="text-ctp-red" />][
                +!settingStore.getResizable()
              ]
            }
          </Button>,
        )}

        {settingItem(
          <div>静默启动</div>,
          <Button
            class="flex-1"
            onClick={() => settingStore.setSilent(!settingStore.getSilent())}>
            {
              [<IconMdiLockOpenVariant class="text-ctp-green" />, <IconMdiLock class="text-ctp-red" />][
                +!settingStore.getSilent()
              ]
            }
          </Button>,
        )}

        <div></div>
      </div>
    );
  },
});
