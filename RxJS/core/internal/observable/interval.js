/*
 * @Author: water.li
 * @Date: 2023-09-16 14:22:36
 * @Description:
 * @FilePath: \Notebook\RxJS\source\internal\observable\interval.js
 */
import { asyncScheduler } from "../scheduler/async";
import { timer } from "./timer";

export function interval(period = 0, scheduler = asyncScheduler) {
  return timer(period, period, scheduler);
}
