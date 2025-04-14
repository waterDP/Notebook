let exampleOnLoadPlugin = {
  name: 'example',
  setup(build) {
    let fs = require('fs')
    build.onResolve({ filter: /\.txt$/ }, async (args) => ({
      path: args.path,
      namespace: 'txt'
    }))

    build.onLoad({ filter: /\.*/, namespace: 'txt' }, async (args) => {
      let text = await fs.promises.readFile(args.paht, 'utf-8')
      return ({
        content: `export default ${JSON.stringify([
          ...text.split(/\s+/)
        ])}`
      })
    })
  }
}

require('esbuild')
  .build({
    entryPoints: ['index.js'],
    bundle: true,
    outdir: 'dist',
    loader: {
      ".png": "dataurl"
    },
    plugins: [exampleOnLoadPlugin]
  })
  .catch(() => process.exit(1))