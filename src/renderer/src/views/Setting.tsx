import { proxyOptions, Settings, shortcutOptions, themeOptions } from "@common/types";
import {
  IconMdiGithub,
  IconMdiLock,
  IconMdiLockOpenVariant,
  IconMdiTransitionMasked,
} from "@renderer/assets";
import { Button, Input, Select, Text } from "@renderer/components";
import { useEsc, useFont, useShortcut, useUpdate } from "@renderer/composables";
import { useSettingStore } from "@renderer/stores";
import { defineComponent, VNode } from "vue";
import { useRouter } from "vue-router";

export default defineComponent(() => {
  const router = useRouter();
  const { fontOptions } = useFont();
  const settingStore = useSettingStore();
  const escHandler = useEsc(() => router.replace({ name: "service" }));
  const { updateState, progressInfo, check, download, upgrade } = useUpdate();
  const { shortcutId, pressedKeyString, handleShortcutInput } = useShortcut(
    () => escHandler.stop(),
    () => escHandler.start(),
    () => escHandler.start(),
  );

  const renderSettings: Record<keyof Settings, () => VNode> = {
    theme: () => (
      <Select
        options={themeOptions}
        value={settingStore.getTheme()}
        onChange={value => settingStore.setTheme(value as keyof typeof themeOptions)}>
        {{ prev: () => "主题" }}
      </Select>
    ),
    font: () => (
      <Select
        options={fontOptions.value}
        value={settingStore.getFont()}
        onChange={value => settingStore.setFont(value)}>
        {{ prev: () => "字体" }}
      </Select>
    ),
    service: () => <></>,
    pronunciationMode: () => (
      <Button onClick={() => settingStore.setPronunciationMode()}>
        {{
          prev: () => "发音模式",
          default: () => (settingStore.getPronunciationMode() === "hover" ? "悬停播放" : "点击播放"),
        }}
      </Button>
    ),
    resizable: () => (
      <Button onClick={() => settingStore.setResizable(!settingStore.getResizable())}>
        {{
          prev: () => "窗口大小",
          default: () =>
            [<IconMdiLockOpenVariant class="text-ctp-green" />, <IconMdiLock class="text-ctp-red" />][
              +!settingStore.getResizable()
            ],
        }}
      </Button>
    ),
    silent: () => (
      <Button onClick={() => settingStore.setSilent(!settingStore.getSilent())}>
        {{
          prev: () => "静默启动",
          default: () =>
            [<IconMdiLockOpenVariant class="text-ctp-green" />, <IconMdiLock class="text-ctp-red" />][
              +!settingStore.getSilent()
            ],
        }}
      </Button>
    ),
    autoTranslate: () => (
      <Button onClick={() => settingStore.setAutoTranslate()}>
        {{
          prev: () => "自动翻译",
          default: () =>
            [<IconMdiLockOpenVariant class="text-ctp-green" />, <IconMdiLock class="text-ctp-red" />][
              +!settingStore.getAutoTranslate()
            ],
        }}
      </Button>
    ),
    autoTranslateDelay: () => (
      <Input
        type="number"
        value={settingStore.getAutoTranslateDelay()}
        onInput={(e: KeyboardEvent) =>
          settingStore.setAutoTranslateDelay((e.target as HTMLInputElement).value as unknown as number)
        }>
        {{ prev: () => "翻译延迟" }}
      </Input>
    ),
    globalShortcuts: () => (
      <>
        {(Object.entries(settingStore.getGlobalShortcuts()) as [keyof typeof shortcutOptions, string][]).map(
          ([id, value]) => (
            <Button
              class={[shortcutId.value === id ? "border-ctp-mauve" : ""]}
              onClick={() => handleShortcutInput(id)}>
              {{
                prev: () => shortcutOptions[id],
                default: () => (shortcutId.value === id ? pressedKeyString.value : value || "未设置"),
              }}
            </Button>
          ),
        )}
      </>
    ),
    proxy: () => {
      const proxy = settingStore.getProxy();
      const proxyFixedFields = [
        {
          label: "地址",
          value: proxy.url,
          onInput: (val: string) => settingStore.setProxy({ ...proxy, url: val }),
        },
        {
          label: "端口",
          value: proxy.port,
          onInput: (val: string) => {
            const num = Number(val);
            if (!isNaN(num)) settingStore.setProxy({ ...proxy, port: num });
          },
        },
        {
          label: "用户",
          value: proxy.username,
          onInput: (val: string) => settingStore.setProxy({ ...proxy, username: val }),
        },
        {
          label: "密码",
          value: proxy.password,
          type: "password",
          onInput: (val: string) => settingStore.setProxy({ ...proxy, password: val }),
        },
      ];
      return (
        <>
          <Select
            value={proxy.mode || ""}
            options={proxyOptions}
            onChange={value =>
              settingStore.setProxy({ ...proxy, mode: value as Electron.ProxyConfig["mode"] })
            }>
            {{ prev: () => <div>模式</div> }}
          </Select>

          {proxy.mode === "fixed_servers" && (
            <>
              {proxyFixedFields.map(field => (
                <Input
                  type={field.type ?? "text"}
                  placeholder={field.label}
                  value={field.value}
                  onInput={(e: KeyboardEvent) => field.onInput((e.target as HTMLInputElement).value)}>
                  {{ prev: () => <div>{field.label}</div> }}
                </Input>
              ))}
            </>
          )}

          {proxy.mode === "pac_script" && (
            <Input
              value={proxy.pacScript}
              onInput={(e: KeyboardEvent) =>
                settingStore.setProxy({ ...proxy, pacScript: (e.target as HTMLInputElement).value })
              }>
              {{ prev: () => <div>脚本</div> }}
            </Input>
          )}
        </>
      );
    },
    servicesConfig: () => <></>,
    appVersion: () => {
      const percent = Math.floor(progressInfo.value?.percent ?? 0);
      return (
        <Text align="end">
          {{
            prev: () => "版本号",
            default: () => (
              <div class="flex flex-row items-center gap-2">
                <Button
                  class={[
                    "min-w-22",
                    `text-ctp-${["text", "mauve", "green", "yellow", "green"][updateState.value]}`,
                    { "pointer-events-none": updateState.value === 2 || updateState.value === 3 },
                  ]}
                  onClick={[check, download, () => {}, () => {}, upgrade][updateState.value]}>
                  {["检查更新", "可用更新", "已是最新", `${percent}%`, "点击安装"][updateState.value]}
                </Button>
                <div class="text-ctp-surface2">{settingStore.getAppVersion()}</div>
              </div>
            ),
          }}
        </Text>
      );
    },
    dbVersion: () => (
      <Text align="end">{{ prev: () => "数据库", default: () => settingStore.getDbVersion() }}</Text>
    ),
    bounds: () => <></>,
  };

  return () => (
    <div class="flex flex-col gap-2 overflow-auto">
      <Button onClick={() => router.replace({ name: "service" })}>
        <IconMdiTransitionMasked class="text-ctp-mauve" />
      </Button>

      <div class="flex flex-1 flex-col gap-2 overflow-auto">
        <Text align="center">基本设置</Text>
        {renderSettings.theme()}
        {renderSettings.font()}
        {renderSettings.resizable()}
        {renderSettings.silent()}
        {renderSettings.pronunciationMode()}
        {renderSettings.autoTranslate()}
        {renderSettings.autoTranslateDelay()}

        <Text align="center">全局快捷键</Text>
        {renderSettings.globalShortcuts()}

        <Text align="center">代理设置</Text>
        {renderSettings.proxy()}

        <Text align="center">关于</Text>
        {renderSettings.appVersion()}
        {renderSettings.dbVersion()}
        <Text align="end">{{ prev: () => "开发者", default: () => "MYQ" }}</Text>

        <Text align="center">
          <IconMdiGithub
            class="hover:text-ctp-text cursor-pointer text-2xl transition-colors"
            onClick={() => window.api.window.openExternal("https://github.com/TYBLHQY/mtranslate")}
          />
        </Text>
      </div>
    </div>
  );
});
