import TranslateBox from "@renderer/components/TranslateBox";
import { defineComponent } from "vue";

export default defineComponent({
  name: "Home",
  components: {
    TranslateBox,
  },
  setup() {
    return () => <TranslateBox />;
  },
});
