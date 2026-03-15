import { deepLProSYGOption, serviceOptions, Services, youdaoZhiYunDomains } from "@common/types";
import {
  IconDeepLProSYG,
  IconFreeDictionary,
  IconMdiCircle,
  IconMdiTransitionMasked,
  IconYoudaoWeb,
  IconYoudaoZhiYun,
} from "@renderer/assets";
import { Button, Input, Select, Tag, Text } from "@renderer/components";
import { useEsc } from "@renderer/composables";
import { useSettingStore } from "@renderer/stores";
import { defineComponent, VNode } from "vue";
import { useRouter } from "vue-router";

export default defineComponent(() => {
  const router = useRouter();
  const settingStore = useSettingStore();
  useEsc(() => router.replace({ name: "service" }));

  const renderTitleBar = ({
    title,
    icon,
    web,
    doc,
    service,
    state,
  }: {
    title: string;
    icon?: string;
    web?: string;
    doc?: string;
    service: keyof Services;
    state: boolean;
  }): VNode => (
    <Text align="end">
      {{
        prev: () => (
          <div class="flex items-center gap-2 leading-none">
            {icon && (
              <img
                src={icon}
                class="text-ctp-blue h-4 w-4 cursor-pointer"
                draggable="false"
                onClick={() => web && window.api.window.openExternal(web)}
              />
            )}

            <div class="flex -translate-y-px items-center select-none">{title}</div>

            {doc && (
              <Tag
                class="flex items-center leading-none select-none"
                onClick={() => window.api.window.openExternal(doc)}>
                Doc
              </Tag>
            )}
          </div>
        ),

        default: () => (
          <IconMdiCircle
            class={["cursor-pointer", state ? "text-ctp-green" : "text-ctp-surface2"]}
            onClick={() => settingStore.setServiceConfig(service, "state", !state)}
          />
        ),
      }}
    </Text>
  );

  const renderServiceConfig: Record<keyof Services, () => VNode> = {
    youdaoWebNew: () =>
      renderTitleBar({
        title: serviceOptions.youdaoWebNew,
        icon: IconYoudaoWeb,
        web: "https://dict.youdao.com/",
        service: "youdaoWebNew",
        state: settingStore.getServicesConfig().youdaoWebNew.state,
      }),
    youdaoWebOld: () =>
      renderTitleBar({
        title: serviceOptions.youdaoWebOld,
        icon: IconYoudaoWeb,
        web: "https://dict.youdao.com/w/",
        service: "youdaoWebOld",
        state: settingStore.getServicesConfig().youdaoWebOld.state,
      }),

    youdaoZhiYun: () => {
      const config = settingStore.getServicesConfig().youdaoZhiYun;
      return (
        <>
          {renderTitleBar({
            title: serviceOptions.youdaoZhiYun,
            icon: IconYoudaoZhiYun,
            web: "https://ai.youdao.com/console/#/",
            doc: "https://ai.youdao.com/DOCSIRMA/html/trans/api/wbfy/index.html",
            service: "youdaoZhiYun",
            state: config.state,
          })}
          {config.state && (
            <>
              <Input
                value={config.appKey}
                type="password"
                onInput={(e: KeyboardEvent) =>
                  settingStore.setServiceConfig("youdaoZhiYun", "appKey", (e.target as HTMLInputElement).value)
                }>
                {{
                  prev: () => "Key",
                }}
              </Input>
              <Input
                value={config.apiSecret}
                type="password"
                onInput={(e: KeyboardEvent) =>
                  settingStore.setServiceConfig("youdaoZhiYun", "apiSecret", (e.target as HTMLInputElement).value)
                }>
                {{ prev: () => "Secret" }}
              </Input>
              <Input
                value={config.vocabId}
                onInput={(e: KeyboardEvent) =>
                  settingStore.setServiceConfig("youdaoZhiYun", "vocabId", (e.target as HTMLInputElement).value)
                }>
                {{
                  prev: () => "术语词表",
                }}
              </Input>
              <Button onClick={() => settingStore.setServiceConfig("youdaoZhiYun", "voice", config.voice === 0 ? 1 : 0)}>
                {{
                  prev: () => "发声模式",
                  default: () => (config.voice === 1 ? "男声" : "女声"),
                }}
              </Button>
              <Button onClick={() => settingStore.setServiceConfig("youdaoZhiYun", "wrapLine", !config.wrapLine)}>
                {{
                  prev: () => "译文换行",
                  default: () => (config.wrapLine ? "开启" : "关闭"),
                }}
              </Button>
              <Button onClick={() => settingStore.setServiceConfig("youdaoZhiYun", "strict", !config.strict)}>
                {{
                  prev: () => "严格语言",
                  default: () => (config.strict ? "开启" : "关闭"),
                }}
              </Button>
              <Select
                value={config.domain}
                options={youdaoZhiYunDomains}
                onChange={value => settingStore.setServiceConfig("youdaoZhiYun", "domain", value as keyof typeof youdaoZhiYunDomains)}>
                {{
                  prev: () => "领域翻译",
                }}
              </Select>
              <Button onClick={() => settingStore.setServiceConfig("youdaoZhiYun", "rejectFallback", !config.rejectFallback)}>
                {{
                  prev: () => "领域降级",
                  default: () => (config.rejectFallback ? "关闭" : "开启"),
                }}
              </Button>
            </>
          )}
        </>
      );
    },
    deepLProSYG: () => {
      const config = settingStore.getServicesConfig().deepLProSYG;
      return (
        <>
          {renderTitleBar({
            title: serviceOptions.deepLProSYG,
            icon: IconDeepLProSYG,
            web: "https://deepl-pro.com/#/translate",
            doc: "https://doc.weixin.qq.com/doc/w3_AR8A8QbQANUX2RVuSxXQiqP31kKiW",
            service: "deepLProSYG",
            state: config.state,
          })}
          {config.state && (
            <>
              <Input
                value={config.authKey}
                type="password"
                onInput={(e: KeyboardEvent) =>
                  settingStore.setServiceConfig("deepLProSYG", "authKey", (e.target as HTMLInputElement).value)
                }>
                {{
                  prev: () => "AuthKey",
                }}
              </Input>
              <Select
                value={config.modelType}
                options={deepLProSYGOption.modelType}
                onChange={value =>
                  settingStore.setServiceConfig("deepLProSYG", "modelType", value as keyof typeof deepLProSYGOption.modelType)
                }>
                {{
                  prev: () => "模型选择",
                }}
              </Select>
              <Select
                value={config.formality}
                options={deepLProSYGOption.formality}
                onChange={value =>
                  settingStore.setServiceConfig("deepLProSYG", "formality", value as keyof typeof deepLProSYGOption.formality)
                }>
                {{
                  prev: () => "语气设置",
                }}
              </Select>
              <Button onClick={() => settingStore.setServiceConfig("deepLProSYG", "showBilledCharacters", !config.showBilledCharacters)}>
                {{
                  prev: () => "计费统计",
                  default: () => (config.showBilledCharacters ? "显示" : "不显示"),
                }}
              </Button>
              <Button onClick={() => settingStore.setServiceConfig("deepLProSYG", "outlineDetection", !config.outlineDetection)}>
                {{
                  prev: () => "标签检测",
                  default: () => (config.outlineDetection ? "开启" : "关闭"),
                }}
              </Button>
              {config.outlineDetection && (
                <>
                  <Select
                    value={config.tagHandling}
                    options={deepLProSYGOption.tagHandling}
                    onChange={value =>
                      settingStore.setServiceConfig("deepLProSYG", "tagHandling", value as keyof typeof deepLProSYGOption.tagHandling)
                    }>
                    {{
                      prev: () => "标签处理",
                    }}
                  </Select>
                  <Input
                    onKeydown={(e: KeyboardEvent) => {
                      if (e.key === "Enter") {
                        const input = (e.target as HTMLInputElement).value.trim();
                        if (!input) return;
                        const newTags = [...new Set(config.nonSplittingTags).add(input)];
                        settingStore.setServiceConfig("deepLProSYG", "nonSplittingTags", newTags);
                        (e.target as HTMLInputElement).value = "";
                      }
                    }}>
                    {{ prev: () => "非拆标签" }}
                  </Input>
                  {config.nonSplittingTags.length > 0 && (
                    <Text align="start">
                      {{
                        prev: () => "",
                        default: () => (
                          <div class="flex flex-row flex-wrap gap-2">
                            {config.nonSplittingTags.map((t, i) => (
                              <Tag
                                key={i}
                                onClick={() => {
                                  const newTags = config.nonSplittingTags.filter((_, ii) => ii !== i);
                                  settingStore.setServiceConfig("deepLProSYG", "nonSplittingTags", newTags);
                                }}>{`<${t}>`}</Tag>
                            ))}
                          </div>
                        ),
                      }}
                    </Text>
                  )}
                  <Input
                    onKeydown={(e: KeyboardEvent) => {
                      if (e.key === "Enter") {
                        const input = (e.target as HTMLInputElement).value.trim();
                        if (!input) return;
                        const newTags = [...new Set(config.splittingTags).add(input)];
                        settingStore.setServiceConfig("deepLProSYG", "splittingTags", newTags);
                        (e.target as HTMLInputElement).value = "";
                      }
                    }}>
                    {{ prev: () => "拆分标签" }}
                  </Input>
                  {config.splittingTags.length > 0 && (
                    <Text align="start">
                      {{
                        prev: () => "",
                        default: () => (
                          <div class="flex flex-row flex-wrap gap-2">
                            {config.splittingTags.map((t, i) => (
                              <Tag
                                key={i}
                                onClick={() => {
                                  const newTags = config.splittingTags.filter((_, ii) => ii != i);
                                  settingStore.setServiceConfig("deepLProSYG", "splittingTags", newTags);
                                }}>
                                {`<${t}>`}
                              </Tag>
                            ))}
                          </div>
                        ),
                      }}
                    </Text>
                  )}
                  <Input
                    value={config.ignoreTags}
                    onKeydown={(e: KeyboardEvent) => {
                      if (e.key !== "Enter") return;
                      const input = e.target as HTMLInputElement;
                      settingStore.setServiceConfig("deepLProSYG", "ignoreTags", input.value);
                      input.blur();
                    }}>
                    {{ prev: () => "免译标签" }}
                  </Input>
                  <Select
                    value={config.splitSentences}
                    options={deepLProSYGOption.splitSentences}
                    onChange={value =>
                      settingStore.setServiceConfig("deepLProSYG", "splitSentences", value as keyof typeof deepLProSYGOption.splitSentences)
                    }>
                    {{
                      prev: () => "分句设置",
                    }}
                  </Select>
                </>
              )}
            </>
          )}
        </>
      );
    },
    freeDictionary: () =>
      renderTitleBar({
        title: serviceOptions.freeDictionary,
        icon: IconFreeDictionary,
        web: "https://www.thefreedictionary.com/",
        doc: "https://www.thefreedictionary.com/api.htm",
        service: "freeDictionary",
        state: settingStore.getServicesConfig().freeDictionary.state,
      }),
  };

  return () => (
    <div class="flex flex-col gap-2">
      <Button onClick={() => router.replace({ name: "service" })}>
        <IconMdiTransitionMasked class="text-ctp-mauve" />
      </Button>

      <div class="flex flex-1 flex-col overflow-auto">
        {Object.values(renderServiceConfig).map((render, index, array) => (
          <div class={["border-ctp-surface1 flex flex-col gap-2 py-3", index < array.length - 1 ? "border-b" : ""]}>{render()}</div>
        ))}
      </div>
    </div>
  );
});
