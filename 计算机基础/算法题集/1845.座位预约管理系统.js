/*
 * @lc app=leetcode.cn id=1845 lang=javascript
 *
 * [1845] 座位预约管理系统
 */
class Heap {
	constructor(data, compare) {
		this.data = data
		this.compare = compare

		for (let i = (data.length >> 1) - 1; i >=0 ; i--) {
			this.heapify(i)
		}
	}
	heapify(index) {
		let target = index
		let left = index * 2 + 1
		let right = index * 2 + 2
		if (left < this.data.length && this.compare(this.data[left], this.data[target])) {
			target = left
		}
		if (right < this.data.length && this.compare(this.data[right], this.data[target])) {
			target = right
		}
		if (target !== index) {
			this.swap(target, index)
			this.heapify(target)
		}
	}
	swap(l, r) {
		let data = this.data;
		[data[l], data[r]] = [data[r], data[l]]
	}
	push(item) {
		this.data.push(item);
		let index = this.data.length - 1
		let father = ((index + 1) >> 1) - 1
		while (father >= 0) {
			if (this.compare(this.data[index], this.data[father])) {
				this.swap(index, father)
				index = father;
				father = ((index + 1) >> 1) - 1
			} else {
				break
			}
		}
	}
	pop() {
		this.swap(0, this.data.length - 1)
		let ret = this.data.pop()
		this.heapify(0)
		return ret
	}
}
/**
 * @param {number} n
 */
var SeatManager = function(n) {
	let data = []
	for (let i = 1; i <= n; i++) {
		data.push(i)
	}
	this.heap = new Heap(data, (lower, higher) => {
		return lower < higher
	})
};

/**
 * @return {number}
 */
SeatManager.prototype.reserve = function() {
	let ret = this.heap.pop()
	return ret
};

/** 
 * @param {number} seatNumber
 * @return {void}
 */
SeatManager.prototype.unreserve = function(seatNumber) {
	this.heap.push(seatNumber)
};

/**
 * Your SeatManager object will be instantiated and called as such:
 * var obj = new SeatManager(n)
 * var param_1 = obj.reserve()
 * obj.unreserve(seatNumber)
 */
// @lc code=end

