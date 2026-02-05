import "@renderer/assets/main.css";

import App from "@renderer/App";
import router from "@renderer/router";
import { createPinia } from "pinia";
import { createApp } from "vue";

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.mount("#app");
