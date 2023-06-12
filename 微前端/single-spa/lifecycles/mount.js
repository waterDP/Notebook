/*
 * @Author: water.li
 * @Date: 2023-06-08 20:43:43
 * @Description:
 * @FilePath: \Notebook\微前端\single-spa\lifecycles\mount.js
 */

import { MOUNTED, NOT_MOUNTED } from "../application/app.helpers";

export function toMountPromise(app) {
  return Promise.resolve().then(() => {
    if (app.status !== NOT_MOUNTED) {
      return app;
    }
    return app.bootstrap(app.customProps).then(() => {
      app.status = MOUNTED;
      return app;
    });
  });
}
