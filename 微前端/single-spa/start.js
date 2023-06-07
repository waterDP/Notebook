/*
 * @Author: water.li
 * @Date: 2023-06-01 22:26:07
 * @Description:
 * @FilePath: \Notebook\微前端\single-spa\start.js
 */
import { reroute } from "./navigation/reroute";
export let started = false; // 默认没有调用start方法
export function start() {
  started = true;
  reroute();
}
