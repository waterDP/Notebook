/*
 * @Author: water.li
 * @Date: 2023-01-18 19:00:18
 * @Description:
 * @FilePath: \Notebook\Axios\defaultes.ts
 */
import { AxiosRequestConfig } from "./types";
import { processHeaders } from "./helpers/header";
import { transformRequest, transformResponse } from "./helpers/data";

const defaults: AxiosRequestConfig = {
  timeout: 0,
  headers: {
    common: {
      Accept: "application/json, text/plain, */*",
    },
  },
  transformRequest: [
    function (data: any, headers: any): any {
      processHeaders(headers, data);
      return transformRequest(data);
    },
  ],
  transformResponse: [
    function (data: any) {
      return transformResponse(data);
    },
  ],
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
};

const methodsNoData = ["delete", "get", "head", "options"];

methodsNoData.forEach((method) => {
  defaults.headers[method] = {};
});

const methodsWithData = ["post", "put", "patch"];

methodsWithData.forEach((method) => {
  defaults.headers[method] = {
    "Content-Type": "application/x-www-form-urlencoded",
  };
});
export default defaults;
