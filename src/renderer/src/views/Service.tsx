import { OptionBar, SourceInput } from "@renderer/components";

import { defineComponent } from "vue";
import { RouterView } from "vue-router";

export default defineComponent(() => {
  return () => (
    <div class="flex flex-col overflow-hidden">
      <SourceInput class="pb-2" />
      <OptionBar />
      <div class="flex min-h-0 flex-4 *:flex-1">
        <RouterView />
      </div>
    </div>
  );
});
