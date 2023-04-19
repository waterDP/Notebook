const preAliasPlugin = require("./preAlias");
const resolvePlugin = require("resolve");
const importAnalysisPlugin = require("./importAnalysis");

async function resolvePlugins(config) {
  // 现在此处返回的是vite的内置插件
  return [
    preAliasPlugin(config),
    resolvePlugin(config),
    importAnalysisPlugin(config),
  ];
}
exports.resolvePlugins = resolvePlugins;
