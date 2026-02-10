import { defineComponent, PropType } from "vue";

export default defineComponent(
  (props, { slots, attrs }) => {
    return () => (
      <div
        class="flex min-h-8 flex-row items-center justify-between gap-2 select-none has-[>_:only-child]:justify-center"
        {...attrs}>
        {slots.prev ? <div class="flex min-w-1/4 items-center gap-2">{slots.prev()}</div> : null}
        <div
          class={[
            "text-ctp-surface2 flex flex-1",
            props.align === "start"
              ? "justify-start"
              : props.align === "center"
                ? "justify-center"
                : "justify-end",
          ]}>
          {slots.default ? slots.default() : null}
        </div>
      </div>
    );
  },
  {
    props: {
      align: {
        type: String as PropType<"start" | "center" | "end">,
        required: true,
      },
    },
  },
);
