import { IconMdiEye, IconMdiEyeOff } from "@renderer/assets";
import { defineComponent, ref } from "vue";

export default defineComponent(
  (_, { slots, attrs }) => {
    const type = ref(attrs.type || "text");

    return () => (
      <div class="flex min-h-8 flex-row items-center justify-between gap-2">
        {slots.prev ? <div class="min-w-1/4 select-none">{slots.prev()}</div> : null}
        <input
          class="bg-ctp-mantle hover:bg-ctp-surface0 focus:border-ctp-mauve flex min-h-8 min-w-8 flex-1 items-center justify-center rounded border-2 px-2 transition-colors"
          {...attrs}
          type={type.value}>
          {slots.icon ? slots.icon() : null}
          {slots.default ? slots.default() : null}
        </input>
        {attrs.type === "password" && (
          <div
            class="text-ctp-surface2 hover:text-ctp-overlay2 cursor-pointer transition-colors select-none"
            onClick={() => (type.value = type.value === "password" ? "text" : "password")}>
            {type.value === "password" ? <IconMdiEyeOff /> : <IconMdiEye />}
          </div>
        )}
      </div>
    );
  },
  {
    emits: ["commit"],
  },
);
