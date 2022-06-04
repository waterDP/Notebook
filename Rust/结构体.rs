/*
 * @Author: water.li
 * @Date: 2022-06-02 12:03:13
 * @LastEditors: water.li
 * @LastEditTime: 2022-06-04 21:40:00
 * @FilePath: \note\Rust\结构体.rs
 */

#[derive(Debug)]
struct Rectangle {
  width: u32,
  length: u32,
}

fn main() {
  let rect = Rectangle {
    width: 30, 
    length: 50
  };

  println!("{}", area(&rect));
  println!("{:#?}", rect);
}

fn area(rect: &Rectangle) -> u32 {
  rect.width * rect.length
}