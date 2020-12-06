class ASTNode {
  constructor(type, value) {
    this.type = type
    if (value) {
      this.value = value
    }
  }
  appendChild(childNode) {
    this.children ? 
      this.children.push(childNode) :
      this.children = [childNode]
  }
}