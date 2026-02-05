import { Option, proxyOptions, Shortcut } from "@common/types";
import Button from "@renderer/components/common/Button";
import Input from "@renderer/components/common/Input";
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

    const updateState = ref(0); // 检查更新 | 可用更新 | 已是最新 | 下载进度 | 点击安装
    const progressInfo = ref<ProgressInfo | null>(null);
    window.api.update.getAvailable((available: boolean) => {
      updateState.value = available ? 1 : 2;
    });
    window.api.update.getDownloadProgress((progress: ProgressInfo) => {
      progressInfo.value = progress;
      updateState.value = 3;
    });
    window.api.update.getUpdateDownloaded((downloaded: boolean) => {
      updateState.value = downloaded ? 4 : 0;
      progressInfo.value = null;
    });

    return () => (
      <div class="flex flex-1 flex-col gap-2 overflow-auto">
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

        {settingTitle("代理配置")}

        {settingItem(
          <div>模式</div>,
          <Select
            class="flex-1"
            options={proxyOptions}
            value={settingStore.getProxy().mode}
            onUpdate:change={(value: Option) =>
              settingStore.setProxy({
                ...settingStore.getProxy(),
                mode: value.code as Electron.ProxyConfig["mode"],
              })
            }
          />,
        )}

        {settingStore.getProxy().mode === "fixed_servers" && (
          <>
            {settingItem(
              <div>地址</div>,
              <Input
                class="flex-1"
                value={settingStore.getProxy().url}
                onInput={(e: KeyboardEvent) =>
                  settingStore.setProxy({
                    ...settingStore.getProxy(),
                    url: (e.target as HTMLInputElement).value,
                  })
                }
              />,
            )}

            {settingItem(
              <div>端口</div>,
              <Input
                class="flex-1"
                value={settingStore.getProxy().port}
                onInput={(e: KeyboardEvent) => {
                  const value = Number((e.target as HTMLInputElement).value);
                  if (!isNaN(value)) {
                    settingStore.setProxy({
                      ...settingStore.getProxy(),
                      port: value,
                    });
                  }
                }}
              />,
            )}

            {settingItem(
              <div>用户名</div>,
              <Input
                class="flex-1"
                value={settingStore.getProxy().username}
                onInput={(e: KeyboardEvent) =>
                  settingStore.setProxy({
                    ...settingStore.getProxy(),
                    username: (e.target as HTMLInputElement).value,
                  })
                }
              />,
            )}

            {settingItem(
              <div>密码</div>,
              <Input
                class="flex-1"
                type="password"
                value={settingStore.getProxy().password}
                onInput={(e: KeyboardEvent) =>
                  settingStore.setProxy({
                    ...settingStore.getProxy(),
                    password: (e.target as HTMLInputElement).value,
                  })
                }
              />,
            )}
          </>
        )}

        {settingStore.getProxy().mode === "pac_script" && (
          <>
            {settingItem(
              <div>PAC脚本</div>,
              <Input
                class="flex-1"
                value={settingStore.getProxy().pacScript}
                onInput={(e: KeyboardEvent) =>
                  settingStore.setProxy({
                    ...settingStore.getProxy(),
                    pacScript: (e.target as HTMLInputElement).value,
                  })
                }
              />,
            )}
          </>
        )}

        {settingTitle("关于")}

        {settingItem(
          <div>版本</div>,
          <div class="flex flex-row items-center gap-2">
            <div class="flex min-w-22 *:flex-1">
              {
                [
                  <Button
                    class="text-ctp-text"
                    onClick={() => window.api.update.check()}>
                    检查更新
                  </Button>,
                  <Button
                    class="text-ctp-mauve"
                    onClick={() => window.api.update.download()}>
                    可用更新
                  </Button>,
                  <Button class="text-ctp-green pointer-events-none">已是最新</Button>,
                  <Button class="text-ctp-yellow pointer-events-none">
                    {progressInfo.value ? Math.floor(progressInfo.value.percent) : 0}%
                  </Button>,
                  <Button
                    class="text-ctp-green"
                    onClick={() => window.api.update.upgrade()}>
                    点击安装
                  </Button>,
                ][updateState.value]
              }
            </div>
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
