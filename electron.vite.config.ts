import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { defineConfig } from "electron-vite";
import { resolve } from "path";
import Icons from "unplugin-icons/vite";
import VueDevTools from "vite-plugin-vue-devtools";

export default defineConfig({
  main: {},
  preload: {},
  renderer: {
    resolve: {
      alias: {
        "@renderer": resolve("src/renderer/src"),
      },
    },
    plugins: [vue(), vueJsx(), tailwindcss(), Icons(), VueDevTools()],
  },
});
