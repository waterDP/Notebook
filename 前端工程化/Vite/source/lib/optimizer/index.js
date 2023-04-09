const scanImports = require("./scan");
const path = require("path");
const { build } = require("esbuild");
const fs = require("fs-extra");
const { normalizePath } = require("../utils");

/**
 * 分析项目依赖的第三方模块
 * @param {*} config
 */
async function createOptimizeDepsRun(config) {
  const deps = await scanImports(config);
  const { cacheDir } = config;
  const depsCacheDir = path.resolve(cacheDir, "deps");
  const metaDataPath = path.join(depsCacheDir, "_metadata.json");

  const metadata = {
    optimized: {},
  };
  for (const id in deps) {
    const entry = deps[id];
    const file = path.resolve(depsCacheDir, id + ".js");
    metadata.optimized[id] = {
      src: entry,
      file,
    };

    await build({
      absWorkingDir: process.cwd(),
      entryPoints: [deps[id]],
      outfile: outfile,
      bundle: true,
      write: true,
      format: "esm",
    });

    await fs.writeFile(
      metaDataPath,
      JSON.stringify(metadata, (key, value) => {
        if (key === "file" || key === "src") {
          return normalizePath(path.relative(depsCacheDir, value));
        }
        return value;
      })
    );
    return { metadata };
  }
}

exports.createOptimizeDepsRun = createOptimizeDepsRun;
