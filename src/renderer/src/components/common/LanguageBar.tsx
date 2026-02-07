import Select from "@renderer/components/base/Select";
import { useTranslationStore } from "@renderer/stores/translation";
import { defineComponent, nextTick, PropType } from "vue";
import IconMdiSwapHorizontal from "~icons/mdi/swap-horizontal";
import Button from "../base/Button";

export default defineComponent({
  props: {
    sourceLang: {
      type: String,
      required: true,
    },
    targetLang: {
      type: String,
      required: true,
    },
    langSupport: {
      type: Object as PropType<Record<string, string>>,
      required: true,
    },
  },
  emits: ["update:changeSource", "update:changeTarget", "update:exchange"],
  setup(props, { emit }) {
    const translationStore = useTranslationStore();
    const reflash = async (): Promise<void> => {
      const currentText = translationStore.getSourceText();
      translationStore.setSourceText("");
      await nextTick();
      translationStore.setSourceText(currentText);
    };
    return () => (
      <div class="bg-ctp-crust flex items-center justify-center">
        <Select
          class="size-0 flex-1 text-sm"
          value={props.sourceLang}
          options={props.langSupport}
          onUpdate:change={(value: string) => {
            emit("update:changeSource", value);
            reflash();
          }}
        />
        <Button
          onClick={() => {
            emit("update:exchange");
            reflash();
          }}>
          <IconMdiSwapHorizontal />
        </Button>
        <Select
          class="size-0 flex-1 text-sm"
          value={props.targetLang}
          options={props.langSupport}
          onUpdate:change={(value: string) => {
            emit("update:changeTarget", value);
            reflash();
          }}
        />
      </div>
    );
  },
});
