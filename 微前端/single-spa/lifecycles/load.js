import {
  LOADING_SOURCE_CODE,
  NOT_BOOTSTRAPED,
  NOT_LOADED,
} from "../application/app.helpers";

function flattenArrayToPromise(fns) {
  fns = Array.isArray(fns) ? fns : [fns];
  return function (props) {
    return fns.reduce(
      (rPromise, fn) => rPromise.then(() => fn(props)),
      Promise.resolve()
    );
  };
}

export function toLoadPromise(app) {
  return Promise.resolve().then(() => {
    if (app.status !== NOT_LOADED) {
      // 此应用加载完毕了
      return app;
    }
    app.status = LOADING_SOURCE_CODE; // 此应用正在加载
    app.loadApp(app.customProps).then((v) => {
      const { bootstrap, mount, unmount } = v;
      app.status = NOT_BOOTSTRAPED;
      app.bootstrap = flattenArrayToPromise(bootstrap);
      app.mount = flattenArrayToPromise(mount);
      app.unmount = flattenArrayToPromise(unmount);
      return app;
    });
  });
}
