import { defineComponent } from "vue";

export default defineComponent((_, { slots }) => {
  return () => (
    <div class="bg-ctp-surface0 text-ctp-blue min-h-6 cursor-pointer items-center rounded px-2 py-0.5 text-sm font-medium">
      {slots.default ? slots.default() : null}
    </div>
  );
});
