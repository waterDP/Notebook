import { defineConfig } from "vite";
import path from "path";
import Vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";

export default defineConfig({
  resolve: {
    alias: [
      {
        find: "@",
        replacement: path.resolve(__dirname, "src"),
      },
    ],
  },
  plugins: [
    Vue(),
    AutoImport({
      resolvers: [],
    }),
    Components({
      resolvers: [],
      dirs: ["src/components", "src/layout/components"],
    }),
  ],
});
