/**
 * vue配置入口文件
 */
module.exports = {
  configureWebpack: {
    resolve: {
      extensions: ['.js', '.vue', '.json', 'css', 'less'],
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    plugins: [
      new webpack.ProvidePlugin({
        _: 'lodash'
      })
    ]
  }
}

/**
 * vue 全局引入
 */
const components = 
  require.context(
    '@/components',
    true,
    /(Base|Page|The|App[A-Z])/
  );

components.keys().forEach(fileName => {
  let componentConfig = components(fileName);
  componentConfig = componentConfig.default || componentConfig;
  let componentName = comoponentConfig.name || (
    fileName
      .replace(/^.+\//, '')
      .replace(/\.\w+$/, '')
  );

  if (componentName) {
    Vue.component(componentName, componentConfig);
  }
})