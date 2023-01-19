/*
 * @Author: water.li
 * @Date: 2023-01-19 14:34:26
 * @Description:
 * @FilePath: \Notebook\Axios\helpers\isURLSameOrigin.ts
 */

type URLOrigin = {
  protocol: string;
  host: string;
  port: string;
};

export default function isURLSameOrigin(requestURL: string): boolean {
  // 1.先获取当前页面地址的协议、域名、端口
  const currentOrigin = resolveURL(window.location.href);
  // 2.再获取请求url的协议、域名、端口
  const parsedOrigin = resolveURL(requestURL);

  // 3.最后比较三者是否相同
  return (
    parsedOrigin.protocol === currentOrigin.protocol &&
    parsedOrigin.host === currentOrigin.host &&
    parsedOrigin.port === currentOrigin.port
  );
}

function resolveURL(url: string): URLOrigin {
  let urlParsingNode = document.createElement("a");
  urlParsingNode.setAttribute("href", url);
  return {
    protocol: urlParsingNode.protocol
      ? urlParsingNode.protocol.replace(/:$/, "")
      : "",
    host: urlParsingNode.host,
    port: urlParsingNode.port,
  };
}
