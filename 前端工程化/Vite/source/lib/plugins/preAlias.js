function preAlias() {
  let server;
  return {
    name: "preAlias",
    configureServer(_server) {
      server = _server;
    },
    resolveId(id) {
      const metadata = server._optimizeDepsMetadata;
      const isOptimized = metadata.optimized[id];
      // 如果有对应的值 说明此模块已经预编译过了
      if (isOptimized) {
        return {
          id: isOptimized.file,
        };
      }
    },
  };
}

module.exports = preAlias;
