/*
 * @Author: water.li
 * @Date: 2023-04-07 20:32:28
 * @Description:
 * @FilePath: \Notebook\前端工程化\Rollup\plugin\demo\rollup-plugin-build.ts
 */
function build(enforce?: "pre" | "post") {
	return {
		name: "build", // 插件的名字
		enforce,
		async options(inputOptions) {
			console.log("options")
			// 此钩子一般不使用 因为它是在汇总配置之前执行的
		},
		async buildStart(inputOptions) {
			// 如果你想读取所有插件的配置内容的汇总，需要buildStart
			console.log("buildStart")
		},
		async resolveId(source, importer) {
			console.log(source)
			console.log(importer)
		},
		async load(id) {
			console.log("load", id)
		},
		async shouldTransformCachedModule({ code, id }) {
			console.log("shouldTransformCacheModule", code, id)
		},
		async transform(code, id) {
			console.log("transform", code, id)
		},
		async moduleParsed(code, id) {
			console.log("moduleParsed", code, id)
		},
		async resolveDynamicImport(specifier, importer) {
			console.log("resolveDynamicImport", specifier, importer)
		},
		async buildEnd() {
			console.log("buildEnd")
		},

		configureServer(server) {
			server.middleares.use((req, res, next) => {
				if ((req.url = "/test")) {
					res.end("Hello world Plugin")
				} else {
					next()
				}
			})
		},

		transformIndexHtml(html) {
			console.log(html)
		},
		handleHotUpdate(ctx) {
			console.log(ctx)
			ctx.server.ws.send({
				type: "custom",
				event: "test"
			})
		}
	}
}

export default build
