import { serviceOptions, ServicesConfig, youdaoZhiYunDomains } from "@common/types";
import Button from "@renderer/components/base/Button";
import Input from "@renderer/components/base/Input";
import Select from "@renderer/components/base/Select";
import Tag from "@renderer/components/base/Tag";
import Text from "@renderer/components/base/Text";
import { useEsc } from "@renderer/composables/useEsc";
import { useSettingStore } from "@renderer/stores/setting";
import { defineComponent, VNode } from "vue";
import { useRouter } from "vue-router";
import IconMdiCircle from "~icons/mdi/circle";
import IconMdiTransitionMasked from "~icons/mdi/transition-masked";

export default defineComponent({
  setup() {
    const router = useRouter();
    const settingStore = useSettingStore();
    useEsc(() => router.replace({ name: "service" }));

    const renderState = (state: boolean, service: keyof ServicesConfig): VNode => (
      <IconMdiCircle
        class={["cursor-pointer", state ? "text-ctp-green" : "text-ctp-surface2"]}
        onClick={() => settingStore.setServiceConfig(service, { state: !state })}
      />
    );

    const renderServiceConfig: Record<keyof ServicesConfig, () => VNode> = {
      youdaoWebNew: () => (
        <Text>
          {{
            prev: () => serviceOptions.youdaoWebNew,
            default: () => renderState(settingStore.getServicesConfig().youdaoWebNew.state, "youdaoWebNew"),
          }}
        </Text>
      ),
      youdaoWebOld: () => (
        <Text>
          {{
            prev: () => serviceOptions.youdaoWebOld,
            default: () => renderState(settingStore.getServicesConfig().youdaoWebOld.state, "youdaoWebOld"),
          }}
        </Text>
      ),
      youdaoZhiYun: () => {
        const config = settingStore.getServicesConfig().youdaoZhiYun;
        return (
          <>
            <Text>
              {{
                prev: () => (
                  <>
                    有道智云
                    <Tag
                      onClick={() =>
                        window.api.window.openExternal(
                          "https://ai.youdao.com/DOCSIRMA/html/trans/api/wbfy/index.html",
                        )
                      }>
                      Doc
                    </Tag>
                  </>
                ),
                default: () => renderState(config.state, "youdaoZhiYun"),
              }}
            </Text>
            {config.state && (
              <>
                <Input
                  value={config.appKey}
                  onInput={(e: KeyboardEvent) =>
                    settingStore.setServiceConfig("youdaoZhiYun", {
                      appKey: (e.target as HTMLInputElement).value,
                    })
                  }>
                  {{
                    prev: () => "Key",
                  }}
                </Input>
                <Input
                  value={config.apiSecret}
                  onInput={(e: KeyboardEvent) =>
                    settingStore.setServiceConfig("youdaoZhiYun", {
                      apiSecret: (e.target as HTMLInputElement).value,
                    })
                  }>
                  {{ prev: () => "Secret" }}
                </Input>
                <Input
                  value={config.vocabId}
                  onInput={(e: KeyboardEvent) =>
                    settingStore.setServiceConfig("youdaoZhiYun", {
                      vocabId: (e.target as HTMLInputElement).value,
                    })
                  }>
                  {{
                    prev: () => "术语词表",
                  }}
                </Input>
                <Button
                  onClick={() =>
                    settingStore.setServiceConfig("youdaoZhiYun", {
                      voice: config.voice === 0 ? 1 : 0,
                    })
                  }>
                  {{
                    prev: () => "发声模式",
                    default: () => (config.voice === 1 ? "男声" : "女声"),
                  }}
                </Button>
                <Button
                  onClick={() =>
                    settingStore.setServiceConfig("youdaoZhiYun", {
                      strict: !config.strict,
                    })
                  }>
                  {{
                    prev: () => "严格语言",
                    default: () => (config.strict ? "开启" : "关闭"),
                  }}
                </Button>
                <Select
                  value={config.domain}
                  options={youdaoZhiYunDomains}
                  onUpdate:change={(value: keyof typeof youdaoZhiYunDomains) =>
                    settingStore.setServiceConfig("youdaoZhiYun", { domain: value })
                  }>
                  {{
                    prev: () => "领域翻译",
                  }}
                </Select>
                <Button
                  onClick={() =>
                    settingStore.setServiceConfig("youdaoZhiYun", {
                      rejectFallback: !config.rejectFallback,
                    })
                  }>
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
    };

    return () => (
      <div class="flex flex-col gap-2">
        <Button onClick={() => router.replace({ name: "service" })}>
          <IconMdiTransitionMasked class="text-ctp-mauve" />
        </Button>

        <div class="flex flex-1 flex-col overflow-auto">
          {Object.values(renderServiceConfig).map((render, index, array) => (
            <div
              class={[
                "border-ctp-surface1 flex flex-col gap-2 py-3",
                index < array.length - 1 ? "border-b" : "",
              ]}>
              {render()}
            </div>
          ))}
        </div>
      </div>
    );
  },
});
