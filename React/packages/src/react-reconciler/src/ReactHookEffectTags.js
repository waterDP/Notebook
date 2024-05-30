/*
 * @Author: water.li
 * @Date: 2024-05-30 07:39:41
 * @Description:
 * @FilePath: \Notebook\React\packages\src\react-reconciler\src\ReactHookEffectTags.js
 */

export const NoFlags /*   */ = 0b0000;
// 有effect
export const HasEffect /* */ = 0b0001;
export const Insertion /* */ = 0b0010;
export const Layout /*    */ = 0b0100;
// 是useEffect
export const Passive /*   */ = 0b1000;
