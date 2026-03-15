import { IconMdiSwapHorizontal } from "@renderer/assets";
import { useTranslationStore } from "@renderer/stores/translation";
import { defineComponent, nextTick, PropType } from "vue";
import Button from "../base/Button";
import Select from "../base/Select";

export default defineComponent(
  (props, { emit }) => {
    const translationStore = useTranslationStore();
    const reflash = async (): Promise<void> => {
      const currentText = translationStore.getSourceText();
      translationStore.setSourceText("");
      await nextTick();
      translationStore.setSourceText(currentText);
    };
    return () => (
      <div class="bg-ctp-crust flex items-center justify-center">
        {props.sourceLang && (
          <Select
            class="size-0 flex-1 text-sm"
            value={props.sourceLang}
            options={props.sourceSupport}
            onChange={(value: string) => {
              emit("updateSource", value);
              reflash();
            }}
          />
        )}
        {props.changeButton && (
          <Button
            onClick={() => {
              emit("updateExchange");
              reflash();
            }}>
            <IconMdiSwapHorizontal />
          </Button>
        )}
        {props.targetLang && (
          <Select
            class="size-0 flex-1 text-sm"
            value={props.targetLang}
            options={props.targetSupport}
            onChange={(value: string) => {
              emit("updateTarget", value);
              reflash();
            }}
          />
        )}
      </div>
    );
  },
  {
    props: {
      changeButton: {
        type: Boolean,
        required: true,
      },
      sourceLang: {
        type: String,
        required: true,
      },
      targetLang: {
        type: String,
        required: true,
      },
      sourceSupport: {
        type: Object as PropType<Record<string, string>>,
        required: true,
      },
      targetSupport: {
        type: Object as PropType<Record<string, string>>,
        required: true,
      },
    },
    emits: ["updateSource", "updateTarget", "updateExchange"],
  },
);
