const { normalizePath } = require("./utils");

async function resolveConfig() {
  const root = normalizePath(process.cwd());
  const config = {
    root,
  };
  return config;
}

module.exports = resolveConfig;
