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