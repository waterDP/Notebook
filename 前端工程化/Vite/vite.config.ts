import { defineConfig } from "vite";
import path from "path";
import Vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import Inspect from "vite-plugin-inspect";

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
    // 按下ctrl+shift，然后点击页面元素会自动打开本地IDE并跳转到对应的代码位置
    Inspect(),
    AutoImport({
      // 自动导入vue的api
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
