/*
 * @Author: water.li
 * @Date: 2022-07-03 18:11:43
 * @LastEditors: water.li
 * @LastEditTime: 2022-07-03 18:21:52
 * @FilePath: \note\Rust\数据类型.rs
 */

// 数组
fn main() {
  let arr1:[u32; 3] = [1, 2, 3]
  show(arr1)

  let tup: (i32, f32, char) = (-3, 6.1, '好')
}
 
// 打印数组
fn show(arr: [u32; 3]) {
  for i in $arr {
    println!("{}", i)
  }
}