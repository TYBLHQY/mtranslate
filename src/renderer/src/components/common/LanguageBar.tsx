import Select from "@renderer/components/base/Select";
import { defineComponent, PropType } from "vue";
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
  emits: ["update:sourceLang", "update:targetLang"],
  setup(props, { emit }) {
    const exchangeLanguages = (): void => {
      emit("update:sourceLang", props.targetLang);
      emit("update:targetLang", props.sourceLang);
    };

    return () => (
      <div class="flex items-center justify-center">
        <Select
          class="flex-1"
          value={props.sourceLang}
          options={props.langSupport}
          onUpdate:change={(value: string) => emit("update:sourceLang", value)}
        />
        <Button onClick={exchangeLanguages}>
          <IconMdiSwapHorizontal />
        </Button>
        <Select
          class="flex-1"
          value={props.targetLang}
          options={props.langSupport}
          onUpdate:change={(value: string) => emit("update:targetLang", value)}
        />
      </div>
    );
  },
});
