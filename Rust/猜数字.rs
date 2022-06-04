/*
 * @Author: water.li
 * @Date: 2022-06-02 10:31:24
 * @LastEditors: water.li
 * @LastEditTime: 2022-06-04 21:39:36
 * @FilePath: \note\Rust\猜数字.rs
 */
use std::io;
use std::cmp::Ordering;

use rand::Rng;

fn main() {
  println!("Hello, world!");
   
  let secrect_num = rand::thread_rng().gen_range(1, 101);
  
  
  loop {
    let mut guess = String::new();
    io::stdin().read_line(&mut guess).expect("无法读取");
  
    let guess:u32 = match guess.trim().parse() {
      Ok(num) => num,
      Err(_) => continue,
    };
  
    match guess.cmp(&secrect_num) {
      Ordering::Less => println!("Too small"),
      Ordering:: Greater => println!("To big"),
      Ordering::Equal => {
        println!("You win");
        break;
      },
    };
  }
}
