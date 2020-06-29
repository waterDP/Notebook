

/// temp
// todo reverse 递归
function reverseLinkList() {
  const reverse = head => {
    if (head === null || head.next === null) return head
    let newHead = reverse(head.next)
    head.next.next = head
    head.next = null
    return newHead
  }
  this.head = reverse(this.head)
  return this.head
}

// todo reverse 非递归
function reverseLinkList1() {
  let head = this.head
  if (head === null || head.next === null) return head
  let newHead = null
  while(head !== null) {
    let temp = head.next
    head.next = newHead
    newHead = head
    head = temp
  }
  this.head = newHead
  return this.head
}