import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { defineConfig } from "electron-vite";
import { resolve } from "path";
import Icons from "unplugin-icons/vite";

export default defineConfig({
  main: {
    resolve: {
      alias: {
        "@main": resolve("src/main"),
        "@common": resolve("src/common"),
        "@resources": resolve("resources"),
      },
    },
  },
  preload: {
    resolve: {
      alias: {},
    },
  },
  renderer: {
    resolve: {
      alias: {
        "@renderer": resolve("src/renderer/src"),
        "@common": resolve("src/common"),
      },
    },
    // plugins: [vue(), vueJsx(), tailwindcss(), Icons(), VueDevTools()],
    plugins: [vue(), vueJsx(), tailwindcss(), Icons()],
  },
});
