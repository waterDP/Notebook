const { normalizePath } = require("./utils");
const path = require("path");
const { resolvePlugins } = require("./plugins");

async function resolveConfig() {
  const root = normalizePath(process.cwd());
  const cacheDir = normalizePath(path.resolve(`node_modules/.vite50`));
  const config = {
    root,
    cacheDir,
  };
  config.pluigns = await resolvePlugins(config);
  return config;
}

module.exports = resolveConfig;
