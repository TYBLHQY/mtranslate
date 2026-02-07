import OptionBar from "@renderer/components/common/OptionBar";
import SourceInput from "@renderer/components/common/SourceInput";
import { defineComponent } from "vue";
import { RouterView } from "vue-router";

export default defineComponent({
  setup() {
    return () => (
      <div class="flex flex-col gap-2 overflow-hidden">
        <SourceInput />
        <OptionBar />
        <div class="flex min-h-0 flex-4 *:flex-1">
          <RouterView />
        </div>
      </div>
    );
  },
});
