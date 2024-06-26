/*
 * @Author: water.li
 * @Date: 2023-01-18 19:00:06
 * @Description:
 * @FilePath: \Notebook\Axios\index.ts
 */
import defaults from "./defaultes";
import Axios from "./core/Axios";
import { AxiosRequestConfig, AxiosStatic } from "./types";
import { extend } from "./helpers/util";
import mergeConfig from "./core/mergeConfig";
import Cancel from "./cancel/Cancel";
import CancelToken from "./cancel/CancelToken";
import isCancel from "./cancel/isCancel";

function createInstance(config: AxiosRequestConfig): AxiosStatic {
  const context = new Axios(config);
  const instance = Axios.prototype.request.bind(context);

  extend(instance, context); // context -> axios

  return instance;
}

const axios = createInstance(defaults);

axios.create = (config: AxiosRequestConfig) => {
  return createInstance(mergeConfig(defaults, config));
};

axios.Cancel = Cancel as any;
axios.CancelToken = CancelToken;
axios.isCancel = isCancel;

axios.all = (promises) => {
  return Promise.all(promises);
};

axios.spread = (callback) => {
  return (arr) => {
    return callback.apply(null, arr);
  };
};

export default axios;
