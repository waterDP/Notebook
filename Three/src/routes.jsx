const routeFiles = import.meta.globEager("/src/views/*.jsx");
const routes = [];

for (const path in routeFiles) {
  const element = routeFiles[path].default;

  routes.push({
    path: path.replace('/src/views', '').replace('.jsx', ''),
    element,
  });
}

routes.push({
  path: '/',
  element: routes[0].element,
});

export default routes;
