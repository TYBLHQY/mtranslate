import { defineComponent } from "vue";

export default defineComponent({
  setup(_, { slots }) {
    return () => (
      <div class="bg-ctp-surface1 text-ctp-blue cursor-pointer items-center rounded px-1 py-0.5 text-sm font-medium">
        {slots.default ? slots.default() : null}
      </div>
    );
  },
});
