import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { defineConfig } from "electron-vite";
import { resolve } from "path";
import icons from "unplugin-icons/vite";

const isDev = process.env.NODE_ENV === "development";

export default defineConfig({
  main: {
    resolve: {
      alias: {
        "@main": resolve("src/main"),
        "@common": resolve("src/common"),
        "@resources": resolve("resources"),
      },
    },
    build: { sourcemap: isDev },
  },
  preload: {
    resolve: {
      alias: {},
    },
    build: { sourcemap: isDev },
  },
  renderer: {
    resolve: {
      alias: {
        "@renderer": resolve("src/renderer/src"),
        "@common": resolve("src/common"),
      },
    },
    plugins: [vue(), vueJsx(), tailwindcss(), icons()],
    build: { sourcemap: isDev },
  },
});
