import { defineComponent } from "vue";
import { RouterView } from "vue-router";

export default defineComponent({
  name: "MainLayout",
  setup() {
    return () => (
      <div class="bg-ctp-base text-ctp-text mocha flex h-screen p-2">
        <RouterView />
      </div>
    );
  },
});
