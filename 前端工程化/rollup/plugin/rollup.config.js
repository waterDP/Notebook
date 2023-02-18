import injectPolyfill from "./demo/rollup-plugin-inject-polyfill.js";

export default {
  input: "./src/index.js",
  output: {
    dir: "dist",
  },
  plugins: [injectPolyfill()],
};
