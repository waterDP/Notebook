#[derive(Debug)]
struct Rectangle {
  width: u32,
  length: u32,
}

impl Rectangle {
  fn area(&self) -> u32 {
    self.width * self.length
  }

  // 关联函数
  fn square(size: u32) -> Rectangle {
    Rectangle { width: size, length: size }
  }
}

fn main() {
  let s = Rectangle::square(20);
  println!("{}", s.area());

  let rect = Rectangle {
    width: 30, 
    length: 50
  };

  println!("{}", rect.area());
  println!("{:#?}", rect);
}
