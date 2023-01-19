/*
 * @Author: water.li
 * @Date: 2023-01-18 19:19:44
 * @Description:
 * @FilePath: \Notebook\Axios\adapters\xhr.ts
 */

import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from "../types";
import { isFormData } from "../helpers/util";
import { AxiosError } from "../helpers/error";
import { parseHeaders } from "../helpers/header";

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const {
      data = null,
      url,
      method = "get",
      headers,
      responseType,
      timeout,
      cancelToken,
      withCredentials,
      xsrfCookieName,
      xsrfHeaderName,
      onDownloadProgress,
      onUploadProgress,
      auth,
    } = config;

    // 1.创建XMHttpRequest异步对象
    const request = new XMLHttpRequest();

    // 2.配置请求参数
    request.open(method.toUpperCase(), url!, true);

    if (isFormData(data)) {
      delete headers["Content-Type"];
    }

    // 3.发送请求
    request.send(data);

    // 中断相关
    if (cancelToken) {
      cancelToken.promise.then((reason) => {
        request.abort();
        reject(reason);
      });
    }

    // 4. 注册事件 拿到响应信息
    // 4.1 网络错误事件
    request.onerror = function () {
      reject(new AxiosError("Net Error", config, request, null));
    };
    // 4.2 网络超时事件
    if (timeout) {
      request.timeout = timeout;
    }
    request.ontimeout = function () {
      reject(
        new AxiosError(
          `Timeout of ${timeout} ms exceeded`,
          config,
          request,
          "TIMEOUT"
        )
      );
    };
    // 4.3 响应成功事件
    request.onreadystatechange = function () {
      if (request.readyState !== 4) {
        return;
      }
      if (request.status === 0) {
        return;
      }
      // 获取响应Header
      const responseHeaders = parseHeaders(request.getAllResponseHeaders());
      // 获取响应data
      const responseData =
        responseType && responseType !== "text"
          ? request.response
          : request.responseText;
      const response: AxiosResponse = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request,
      };
      handleRequest(response);
    };
    function handleRequest(response: AxiosResponse) {
      if (response.status >= 200 && response.status < 300) {
        resolve(response);
      } else {
        reject(
          new AxiosError(
            `Request failed with status code ${response.status}`,
            config,
            request,
            request.status,
            response
          )
        );
      }
    }
  });
}
