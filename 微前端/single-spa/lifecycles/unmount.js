import { MOUNTED, NOT_MOUNTED, UNMOUNTING } from "../application/app.helpers";

export function toUnmountPromise(app) {
  return Promise.resolve().then(() => {
    if (app.status !== MOUNTED) {
      return app;
    }
    app.status = UNMOUNTING;
    return app.unmount(app.customProps).then(() => {
      app.status = NOT_MOUNTED;
    });
  });
}
