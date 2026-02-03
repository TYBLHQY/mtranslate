import { defineComponent } from "vue";

export default defineComponent({
  setup(_, { slots, attrs }) {
    return () => (
      <button
        class="text-ctp-overlay0 hover:text-ctp-text flex min-h-8 min-w-8 cursor-pointer flex-row items-center justify-center gap-1 rounded transition-colors outline-none"
        type={attrs.type || "button"}
        {...attrs}>
        {slots.icon ? slots.icon() : null}
        {slots.default ? slots.default() : null}
      </button>
    );
  },
});
