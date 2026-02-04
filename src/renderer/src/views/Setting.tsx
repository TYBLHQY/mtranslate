import { Option, Shortcut } from "@common/types";
import Button from "@renderer/components/common/Button";
import Select from "@renderer/components/common/Select";
import { useEsc } from "@renderer/composables/useEsc";
import { useShortcut } from "@renderer/composables/useGlobalShotcut";
import { useSettingStore } from "@renderer/stores/setting";
import { ProgressInfo } from "electron-updater";
import { defineComponent, ref, VNode } from "vue";
import { useRouter } from "vue-router";
import IconMdiGithub from "~icons/mdi/github";
import IconMdiLock from "~icons/mdi/lock";
import IconMdiLockOpenVariant from "~icons/mdi/lock-open-variant";
import IconMdiTransitionMasked from "~icons/mdi/transition-masked";

export default defineComponent({
  setup() {
    const router = useRouter();
    const settingStore = useSettingStore();
    const escHandler = useEsc(() => router.push({ name: "Home" }));

    const fontOptions = ref<Option[]>([]);
    const themeOptions: Option[] = [
      { code: "latte", name: "latte" },
      { code: "mocha", name: "mocha" },
      { code: "frappe", name: "frappe" },
      { code: "macchiato", name: "macchiato" },
    ];

    window.api.window
      .getFonts()
      .then((fonts: string[]) => (fontOptions.value = fonts.map(font => ({ code: font, name: font }))))
      .finally(() => fontOptions.value.unshift({ code: "system-ui", name: "System Default" }));

    const settingTitle = (title: string): VNode => <div class="text-ctp-surface2 text-center">{title}</div>;

    const settingItem = (name: VNode, content: VNode): VNode => (
      <div class="flex min-h-8 flex-row items-center justify-between gap-2">
        {name}
        {content}
      </div>
    );

    const currentShortcut = ref<Shortcut>();
    const { pressedKeyString, handleShortcutInput } = useShortcut(
      () => escHandler.stop(),
      () => {
        escHandler.start();
        currentShortcut.value = undefined;
      },
      () => {
        escHandler.start();
        settingStore.setGlobalShortcut({
          ...currentShortcut.value!,
          key: pressedKeyString.value,
        });
        currentShortcut.value = undefined;
      },
    );

    const isAvailable = ref(false);
    const progressInfo = ref<ProgressInfo | null>(null);
    const isDownloaded = ref(false);
    window.api.update.getAvailable((available: boolean) => {
      isAvailable.value = available;
    });
    window.api.update.getDownloadProgress((progress: ProgressInfo) => {
      progressInfo.value = progress;
      isAvailable.value = false;
    });
    window.api.update.getUpdateDownloaded((downloaded: boolean) => {
      isDownloaded.value = downloaded;
      isAvailable.value = false;
      progressInfo.value = null;
    });
    window.api.update.check();

    return () => (
      <div class="flex flex-1 flex-col gap-2 overflow-hidden">
        <Button onClick={() => router.push({ name: "Home" })}>
          {{ icon: () => <IconMdiTransitionMasked class="text-ctp-mauve" /> }}
        </Button>

        {settingTitle("基本配置")}

        {settingItem(
          <div>主题</div>,
          <Select
            class="flex-1"
            options={themeOptions}
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

        {settingItem(
          <div>发音模式</div>,
          <Button
            class="flex-1"
            onClick={() =>
              settingStore.setPronunciationMode(
                settingStore.getPronunciationMode() === "hover" ? "click" : "hover",
              )
            }>
            {settingStore.getPronunciationMode() === "hover" ? "悬停播放" : "点击播放"}
          </Button>,
        )}

        {settingTitle("全局快捷键")}

        {settingStore.getGlobalShortcuts().map(s => (
          <div class="flex flex-row items-center justify-between gap-2">
            <div>{s.name}</div>
            <Button
              class={["flex-1 text-sm", currentShortcut.value?.id === s.id ? "border-ctp-mauve" : ""]}
              onClick={() => {
                currentShortcut.value = s;
                handleShortcutInput();
              }}>
              {currentShortcut.value?.id === s.id ? pressedKeyString.value : s.key || "未设置"}
            </Button>
          </div>
        ))}

        {settingTitle("关于")}

        {settingItem(
          <div>版本</div>,
          <div class="flex flex-row items-center gap-2">
            {isAvailable.value && (
              <Button
                class="text-ctp-mauve min-w-22"
                onClick={() => window.api.update.download()}>
                可用更新
              </Button>
            )}
            {progressInfo.value && (
              <Button class="text-ctp-yellow pointer-events-none min-w-22">
                {Math.floor(progressInfo.value.percent)}%
              </Button>
            )}
            {isDownloaded.value && (
              <Button
                class="text-ctp-green min-w-22"
                onClick={() => window.api.update.upgrade()}>
                安装更新
              </Button>
            )}
            <div class="text-ctp-surface2">{settingStore.getAppVersion()}</div>
          </div>,
        )}

        {settingItem(<div>作者</div>, <div class="text-ctp-surface2">MYQ</div>)}

        <div class="flex justify-center">
          <IconMdiGithub
            class="text-ctp-surface2 hover:text-ctp-text cursor-pointer text-2xl transition-colors"
            onClick={() => window.api.window.openExternal("https://github.com/TYBLHQY/mtranslate")}
          />
        </div>
      </div>
    );
  },
});
