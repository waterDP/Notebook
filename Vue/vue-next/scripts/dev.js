import minimist from "minimist";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import esbuild from "esbuild";

const args = minimist(process.argv.slice(2));
const format = args.f || "iife";
const target = args._[0] || "reactivity";

const __dirname = dirname(fileURLToPath(import.meta.url));

const IIFENamesMap = {
  reactivity: "VueReactivity",
};

esbuild
  .context({
    entryPoints: [resolve(__dirname, `../packages/${target}/src/index.ts`)],
    outfile: resolve(__dirname, `../packages/${target}/dist/${target}.js`),
    bundle: true, // 将所有的文件打包在一起
    sourcemap: true,
    format,
    globalName: IIFENamesMap[target],
    platform: "browser",
  })
  .then((ctx) => ctx.watch());
