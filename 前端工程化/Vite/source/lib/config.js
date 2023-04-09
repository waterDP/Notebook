const { normalizePath } = require("./utils");
const path = require("path");

async function resolveConfig() {
  const root = normalizePath(process.cwd());
  const cacheDir = normalizePath(path.resolve(`node_modules/.vite50`));
  const config = {
    root,
    cacheDir,
  };
  return config;
}

module.exports = resolveConfig;
