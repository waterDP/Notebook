/**
 * 实现一个并发请求的函数（urls, concurrent）
 * 1. 要求有最大并发数
 * 2. 当一个请求结束的时候可以开启排队中的新的请求
 * 3. 最后打印的结果 的时候顺序不能乱 要和urls的顺序保持一致
 */
import { from, mergeMap } from "rxjs";

const urls = ["/urls/1", "/urls/2", "/urls/3"];

function fetchData(url) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(url), 3000);
  });
}

const start = Date.now();
function multiRequest(urls, concurrent) {
  from(urls)
    .pipe(mergeMap(fetchData, concurrent))
    .subscribe((value) => {
      console.log(`耗时${parseInt((Date.now() - start) / 1000)}s`);
      console.log(value);
    });
}

multiRequest(urls);
