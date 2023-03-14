/*
 * @Author: water.li
 * @Date: 2023-02-25 21:43:52
 * @Description:
 * @FilePath: \Notebook\React\source\vite.config.js
 */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  server: {
    hmr: true,
  },
  resolve: {
    alias: {
      react: path.posix.resolve("src/react"),
      "react-dom": path.posix.resolve("src/react-dom"),
      "react-dom-bindings": path.posix.resolve("src/react-dom-bindings"),
      "react-reconciler": path.posix.resolve("src/react-reconciler"),
      scheduler: path.posix.resolve("src/scheduler"),
      shared: path.posix.resolve("src/shared"),
    },
  },
  plugins: [react()],
});
