"use strict";

/*
 * @lc app=leetcode.cn id=2 lang=javascript
 *
 * [2] 两数相加
 */
// @lc code=start

/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */

/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var addTwoNumbers = function addTwoNumbers(l1, l2) {
  var result = p = {};

  while (l1 || l2) {
    // 求和
    var sum = (l1 && l1.val || 0) + (l2 && l2.val || 0) + (p.val || 0); // 取整

    var exceed = parseInt(sum / 10);
    l1 = l1 && l1.next;
    l2 = l2 && l2.next; // 取余

    p.val = sum % 10; // 判断是否需要进位（新增链表节点）（试试不带 if 条件跑一遍就明白了）

    if (l1 || l2 || exceed) {
      p.next = {
        val: exceed
      };
    }

    p = p.next;
  }

  return result;
}; // @lc code=end