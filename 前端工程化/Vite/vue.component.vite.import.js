/*
 * @Author: water.li
 * @Date: 2025-04-12 22:04:31
 * @Description: 
 * @FilePath: \Notebook\前端工程化\Vite\vue.component.vite.import.js
 */
const components = import.meta.glob('./**/*.vue', {
  eager: true,
  import: 'default'
});

// 注册组件
Object.entries(components).forEach(([path, component]) => {
  const name = path.split('/').pop().replace('.vue', '');
  app.component(name, component);
});