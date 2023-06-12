/*
 * @Author: water.li
 * @Date: 2023-06-08 20:43:32
 * @Description:
 * @FilePath: \Notebook\微前端\single-spa\lifecycles\boostrap.js
 */
import {
  BOOTSTRAPING,
  NOT_BOOTSTRAPED,
  NOT_MOUNTED,
} from "../application/app.helpers";

export function toBootstrapPromise(app) {
  return Promise.resolve().then(() => {
    if (app.status !== NOT_BOOTSTRAPED) {
      return app;
    }
    app.status = BOOTSTRAPING;
    return app.bootstrap(app.customProps).then(() => {
      app.status = NOT_MOUNTED;
      return app;
    });
  });
}
