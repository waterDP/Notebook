/*
 * @Author: water.li
 * @Date: 2023-01-18 22:43:28
 * @Description:
 * @FilePath: \Notebook\Axios\core\Axios.ts
 */
import {
  AxiosPromise,
  AxiosRequestConfig,
  AxiosResponse,
  Method,
  RejectedFn,
  ResolvedFn,
} from "../types";
import { InterceptorManager } from "./InterceptorManager";
import dispatchRequest, { transformUrl } from "./dispatchRequest";
import mergeConfig from "./mergeConfig";

type PromiseArr<T> = {
  resolved: ResolvedFn<T> | ((config: AxiosRequestConfig) => AxiosPromise);
  rejected?: RejectedFn;
};

export default class Axios {
  defaults: AxiosRequestConfig;
  interceptors: {
    request: InterceptorManager<AxiosRequestConfig>;
    response: InterceptorManager<AxiosResponse<any>>;
  };
  constructor(defaultConfig: AxiosRequestConfig) {
    this.defaults = defaultConfig;
    this.interceptors = {
      request: new InterceptorManager<AxiosRequestConfig>(),
      response: new InterceptorManager<AxiosResponse>(),
    };
  }
  request(url: any, config?: any): AxiosPromise {
    if (typeof url === "string") {
      config = config ? config : {};
    } else {
      config = url;
    }
    // merge
    config = mergeConfig(this.defaults, config);

    // ^ interceptor
    let arr: PromiseArr<any>[] = [
      {
        resolved: dispatchRequest,
        rejected: undefined,
      },
    ];
    this.interceptors.request.forEach((interceptor) => {
      arr.unshift(interceptor);
    });
    this.interceptors.response.forEach((interceptor) => {
      arr.push(interceptor);
    });

    let promise = Promise.resolve(config);

    while (arr.length) {
      const { resolved, rejected } = arr.shift()!;
      promise.then(resolved, rejected);
    }
    return promise;
  }

  get(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this.requestMethodWithoutData("GET", url, config);
  }

  delete(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this.requestMethodWithoutData("POST", url, config);
  }

  options(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this.requestMethodWithoutData("OPTIONS", url, config);
  }

  post(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this.requestMethodWithData("OPTIONS", url, data, config);
  }

  put(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this.requestMethodWithData("PUT", url, data, config);
  }

  patch(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this.requestMethodWithData("PATCH", url, data, config);
  }

  getUri(config?: AxiosRequestConfig): string {
    config = mergeConfig(this.defaults, config);
    return transformUrl(config);
  }

  private requestMethodWithData(
    method: Method,
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ) {
    return this.request(url, { method, data, config });
  }
  private requestMethodWithoutData(
    method: Method,
    url: string,
    config?: AxiosRequestConfig
  ) {
    return this.request(url, { method, config });
  }
}
