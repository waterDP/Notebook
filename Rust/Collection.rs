/*
 * @Author: water.li
 * @Date: 2022-06-02 15:18:19
 * @LastEditors: water.li
 * @LastEditTime: 2022-06-04 21:40:08
 * @FilePath: \note\Rust\Collection.rs
 */
fn main() {
  let v = vec![1,2,3];
  
  let third: &i32 = &v[2];
  println!("The third element is {}", third)
  
  match v.get(2) {
    Some(third) => println("The third element is {}", third),
    None => println("There is no third element")
  }

  for i in &mut v {
    *i += 50
  }
  for i in v {
    println!("{}", i)
  }
}
