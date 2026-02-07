import { defineComponent, PropType } from "vue";

export default defineComponent({
  props: {
    value: { type: String as PropType<string>, required: true },
    options: { type: Object as PropType<Record<string, string>>, required: true },
  },
  emits: ["update:change"],
  setup(props, { attrs, emit, slots }) {
    const handleChange = (e: Event): void => emit("update:change", (e.target as HTMLSelectElement).value);

    return () => (
      <div class="flex min-h-8 flex-row items-center justify-between gap-2">
        {slots.prev ? <div class="min-w-1/4">{slots.prev()}</div> : null}
        <select
          class="bg-ctp-crust hover:bg-ctp-surface0 min-h-8 min-w-8 flex-1 cursor-pointer appearance-none rounded text-center transition-colors outline-none"
          value={props.value}
          onChange={handleChange}
          {...attrs}>
          {Object.entries(props.options).map(([code, name]) => (
            <option
              class="bg-ctp-crust text-center"
              key={code}
              value={code}>
              {name}
            </option>
          ))}
        </select>
      </div>
    );
  },
});
