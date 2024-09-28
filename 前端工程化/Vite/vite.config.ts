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
      imports: ["vue", "vue-router", "pinia"],
      resolvers: [],
      eslintrc: { enabled: true }, // 给eslint生产的配置，只需要一次生成就可以了
    }),
    Components({
      resolvers: [],
      dirs: ["src/components", "src/layout/components"],
    }),
  ],
});
