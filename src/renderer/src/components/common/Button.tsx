import { defineComponent } from "vue";

export default defineComponent({
  setup(_, { slots, attrs }) {
    return () => (
      <button
        class="bg-ctp-crust hover:bg-ctp-surface0 flex min-h-8 min-w-8 cursor-pointer appearance-none items-center justify-center rounded border-2 px-2 text-center transition-colors outline-none"
        type={attrs.type || "button"}
        {...attrs}>
        {slots.icon ? slots.icon() : null}
        {slots.default ? slots.default() : null}
      </button>
    );
  },
});
