import { defineComponent } from "vue";

export default defineComponent({
  props: {
    visible: { type: Boolean, required: true },
  },
  setup(_, { slots }) {
    return () => (
      <div>
        {_.visible ? (
          <div class="fixed inset-0 z-50 flex items-center justify-center">
            <div class="absolute inset-0 bg-black/40" />
            <div class="bg-ctp-surface relative z-10 rounded p-3 shadow">{slots.default?.()}</div>
          </div>
        ) : null}
      </div>
    );
  },
});
