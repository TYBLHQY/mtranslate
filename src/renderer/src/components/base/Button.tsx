import { defineComponent } from "vue";

export default defineComponent(
  (props, { slots, attrs }) => {
    return () => (
      <div class="flex min-h-8 flex-row items-center justify-between gap-2 select-none">
        {slots.prev ? <div class="min-w-1/4">{slots.prev()}</div> : null}
        <button
          class="bg-ctp-crust hover:bg-ctp-surface0 flex min-h-8 min-w-8 flex-1 cursor-pointer appearance-none items-center justify-center rounded border-2 text-center transition-colors"
          type={attrs.type || "button"}
          onClick={() => props.onClick && props.onClick()}
          {...attrs}>
          {slots.default ? slots.default() : null}
        </button>
      </div>
    );
  },
  {
    props: {
      onClick: { type: Function, required: false },
    },
  },
);
