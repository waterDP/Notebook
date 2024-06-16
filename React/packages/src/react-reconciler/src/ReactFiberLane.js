/*
 * @Author: water.li
 * @Date: 2024-06-16 21:23:29
 * @Description: 
 * @FilePath: \Notebook\React\packages\src\react-reconciler\src\ReactFiberLane.js
 */

export const TotalLanes = 31;
// 无 0
export const NoLanes = /*                        */ 0b0000000000000000000000000000000;
export const NoLane = /*                          */ 0b0000000000000000000000000000000;

export const SyncHydrationLane = /*               */ 0b0000000000000000000000000000001;
// 同步车道
export const SyncLane = /*                        */ 0b0000000000000000000000000000010;
export const SyncLaneIndex = 1;
// 输入连续水合车道
export const InputContinuousHydrationLane = /*    */ 0b0000000000000000000000000000100;
// 输入连续车道
export const InputContinuousLane = /*             */ 0b0000000000000000000000000001000;
// 默认水合车道
export const DefaultHydrationLane = /*            */ 0b0000000000000000000000000010000;
// 默认车道
export const DefaultLane = /*                     */ 0b0000000000000000000000000100000;

export const SyncUpdateLanes = enableUnifiedSyncLane
  ? SyncLane | InputContinuousLane | DefaultLane
  : SyncLane;

const TransitionHydrationLane = /*                */ 0b0000000000000000000000001000000;
const TransitionLanes = /*                       */ 0b0000000001111111111111110000000;
const TransitionLane1 = /*                        */ 0b0000000000000000000000010000000;
const TransitionLane2 = /*                        */ 0b0000000000000000000000100000000;
const TransitionLane3 = /*                        */ 0b0000000000000000000001000000000;
const TransitionLane4 = /*                        */ 0b0000000000000000000010000000000;
const TransitionLane5 = /*                        */ 0b0000000000000000000100000000000;
const TransitionLane6 = /*                        */ 0b0000000000000000001000000000000;
const TransitionLane7 = /*                        */ 0b0000000000000000010000000000000;
const TransitionLane8 = /*                        */ 0b0000000000000000100000000000000;
const TransitionLane9 = /*                        */ 0b0000000000000001000000000000000;
const TransitionLane10 = /*                       */ 0b0000000000000010000000000000000;
const TransitionLane11 = /*                       */ 0b0000000000000100000000000000000;
const TransitionLane12 = /*                       */ 0b0000000000001000000000000000000;
const TransitionLane13 = /*                       */ 0b0000000000010000000000000000000;
const TransitionLane14 = /*                       */ 0b0000000000100000000000000000000;
const TransitionLane15 = /*                       */ 0b0000000001000000000000000000000;

const RetryLanes = /*                            */ 0b0000011110000000000000000000000;
const RetryLane1 = /*                             */ 0b0000000010000000000000000000000;
const RetryLane2 = /*                             */ 0b0000000100000000000000000000000;
const RetryLane3 = /*                             */ 0b0000001000000000000000000000000;
const RetryLane4 = /*                             */ 0b0000010000000000000000000000000;

export const SomeRetryLane = RetryLane1;

export const SelectiveHydrationLane = /*          */ 0b0000100000000000000000000000000;

const NonIdleLanes = /*                          */ 0b0000111111111111111111111111111;

export const IdleHydrationLane = /*               */ 0b0001000000000000000000000000000;
export const IdleLane = /*                        */ 0b0010000000000000000000000000000;

export const OffscreenLane = /*                   */ 0b0100000000000000000000000000000;
export const DeferredLane = /*                    */ 0b1000000000000000000000000000000;