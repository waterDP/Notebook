/*
 * @Author: water.li
 * @Date: 2023-04-07 20:32:28
 * @Description:
 * @FilePath: \Notebook\前端工程化\rollup\plugin\demo\rollup-plugin-build.js
 */
function build() {
  return {
    name: "build", // 插件的名字
    async options(inputOptions) {
      console.log("options");
      // 此钩子一般不使用 因为它是在汇总配置之前执行的
    },
    async buildStart(inputOptions) {
      // 如果你想读取所有插件的配置内容的汇总，需要buildStart
      console.log("buildStart");
    },
    async resolveId(source, importer) {
      console.log(source);
      console.log(importer);
    },
    async load(id) {
      console.log("load", id);
    },
    async shouldTransformCachedModule({ code, id }) {
      console.log("shouldTransformCacheModule", code, id);
    },
    async transform(code, id) {
      console.log("transform", code, id);
    },
    async moduleParsed(code, id) {
      console.log("moduleParsed", code, id);
    },
    async resolveDynamicImport(specifier, importer) {
      console.log("resolveDynamicImport", specifier, importer);
    },
    async buildEnd() {
      console.log("buildEnd");
    },
  };
}

export default build;
