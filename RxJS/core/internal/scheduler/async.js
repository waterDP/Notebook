/*
 * @Author: water.li
 * @Date: 2023-09-16 13:52:28
 * @Description:
 * @FilePath: \Notebook\RxJS\source\internal\scheduler\async.js
 */

export { Scheduler } from "../Scheduler";
export { AsyncAction } from "./AsyncAction";

export const asyncScheduler = new Scheduler(AsyncAction);
