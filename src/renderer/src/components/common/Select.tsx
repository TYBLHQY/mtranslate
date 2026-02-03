import { Option } from "@common/types";
import { defineComponent, PropType } from "vue";

export default defineComponent({
  props: {
    value: { type: String as PropType<string>, required: true },
    options: { type: Array as PropType<Option[]>, required: true },
  },
  emits: ["update:change"],
  setup(props, { attrs, emit }) {
    const handleChange = (e: Event): void => {
      const value = (e.target as HTMLSelectElement).value;
      const selectedOption = props.options.find(opt => opt.code === value);
      if (selectedOption) emit("update:change", selectedOption);
    };

    return () => (
      <select
        class="bg-ctp-crust hover:bg-ctp-surface0 min-h-8 min-w-8 cursor-pointer appearance-none rounded text-center transition-colors outline-none"
        value={props.value}
        onChange={handleChange}
        {...attrs}>
        {props.options.map(opt => (
          <option
            class="bg-ctp-crust text-center"
            key={opt.code}
            value={opt.code}>
            {opt.name}
          </option>
        ))}
      </select>
    );
  },
});
