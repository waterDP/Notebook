/*
 * @Author: water.li
 * @Date: 2023-01-03 23:48:27
 * @Description:
 * @FilePath: \Notebook\React\packages\src\react-reconciler\src\ReactFiberFlags.js
 */

export const NoFlags /*           */ = 0b000000000000000000; // 0
export const Placement /*         */ = 0b000000000000000010; // 2
export const Update /*            */ = 0b000000000000000100; // 4
export const ChildDeletion /*     */ = 0b000000000000001000; // 8
export const MutationMask /*      */ = Placement | Update | ChildDeletion;
export const Passive /*           */ = 0b0000000000000000100000000000; // 1024
