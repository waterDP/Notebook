let envPlugin = {
  name: "env", // 插件的名字
  setup(build) {
    // 设置函数
    build.onResolve(
      {
        filter: /^env$/,
      },
      (onResolveArgs) => {
        return {
          external: false, // 是否是外部模块，如果是外部模块的话不处理了
          namespace: "env-namespace", // 表示此模块属性env-namespace命名空间了
          path: onResolveArgs.path, // env 解析得到的路径，在默认情况下
          //如果是普通模块的话 会返回普通模块文件系统中的绝对路径
        };
      }
    );

    // ~ 代理生产一个虚拟模块
    build.onLoad({ filter: /^env$/ }, () => {
      return {
        contents: 'export const OS = "windowNT"',
        loader: "js",
      };
    });
  },
};

require("esbuild")
  .build({
    entryPoints: ["entry.js"],
    bundle: true,
    plugins: [envPlugin],
    outfile: "out.js",
  })
  .catch(console.log);
