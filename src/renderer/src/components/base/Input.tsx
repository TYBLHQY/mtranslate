import { defineComponent } from "vue";

export default defineComponent({
  setup(_, { slots, attrs }) {
    return () => (
      <div class="flex min-h-8 flex-row items-center justify-between gap-2">
        {slots.prev ? <div class="min-w-1/4">{slots.prev()}</div> : null}
        <input
          class="bg-ctp-mantle hover:bg-ctp-surface0 focus:border-ctp-mauve flex min-h-8 min-w-8 flex-1 appearance-none items-center justify-center rounded border-2 px-2 transition-colors"
          type={attrs.type || "text"}
          {...attrs}>
          {slots.icon ? slots.icon() : null}
          {slots.default ? slots.default() : null}
        </input>
      </div>
    );
  },
});
