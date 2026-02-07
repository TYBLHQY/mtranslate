import { defineComponent } from "vue";

export default defineComponent({
  setup(_, { slots }) {
    return () => (
      <div
        class={`flex min-h-8 flex-row items-center justify-between gap-2 has-[>_:only-child]:justify-center`}>
        {slots.prev ? <div class="flex min-w-1/4 items-center gap-2">{slots.prev()}</div> : null}
        <div class="text-ctp-surface2">{slots.default ? slots.default() : null}</div>
      </div>
    );
  },
});
