let EventEmitter = require('events')
let fs = require('fs')
class Node {
	constructor(element) {
		this.element = element
		this.next = null
	}
}

class LinkList {
	constructor() {
		this.head = null
		this.length = 0
	}
	append(chunk) {
		let node = new Node(chunk);
		if (this.head == null) { // 链表的头
			this.head = node
		} else {
			// 找到最后一个把当前节点 放到后面去
			let current = this.head
			while (current.next) {
				current = current.next
			}
			current.next = node
		}
		this.length++
	}
	get() {
		let head = this.head
		if (!head) return
		this.head = head.next
		this.length--
		return head.element
	}
}

// Writable 接口  WriteStream

module.exports = class extends EventEmitter {
	constructor(path, options) {
		super()
		this.path = path
		this.flags = options.flags || 'w'
		this.highWaterMark = options.highWaterMark || 16 * 1024
		this.autoClose = options.autoClose || true
		this.start = options.start || 0
		this.mode = options.mode || 0o666
		this.encoding = options.encoding || 'utf8'


		//  判断当前是否正在写入
		this._writing = false
		// 如果不是正在写入就将当前的内容 放到链表中存起来
		this.cache = new LinkList()
		// 只有当前消耗掉了和期望值相等或者大于期望值的时候 设置成true
		this.needDrain = false
		// 写入的位置的偏移量
		this.pos = this.start
		this.open() // 打开文件准备写入 

		this.len = 0 // 用来统计写入的个数 不用每次算LinkList长度
	}
	// chunk buffer or string   fs.write(fd,buffer)
	write(chunk, encoding = this.encoding, callback) {
		chunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
		this.len += chunk.length
		let flag = this.len < this.highWaterMark
		this.needDrain = !flag // 写入时需要更改needDrain
		// 返回值 写入的总大小 和 期望比

		if (this._writing) {
			// 放到链表中
			this.cache.append({
				chunk,
				encoding,
				callback
			});
		} else {
			// 真正的写入
			this._writing = true;
			// 第一次写入的逻辑
			this._write(chunk, encoding, () => {
				// todo...
				callback && callback()
				this.clearBuffer() // 清空缓存中的数据
			}); //真正的写入逻辑
		}
		return flag;
	}
	clearBuffer() { // 依次从链表中清空数据
		let obj = this.cache.get()
		if (obj) {
			this._write(obj.chunk, obj.encoding, () => {
				obj.callback && obj.callback();
				this.clearBuffer();
			})
		} else {
			this._writing = false; // 下次在调用write 可以直接向文件中写入
			if (this.needDrain) { // 触发drain事件
				this.needDrain = false;
				this.emit('drain')
			}
		}
	}
	open() {
		fs.open(this.path, this.flags, (err, fd) => {
			this.fd = fd;
			this.emit('open', fd)
		})
	}
	_write(chunk, encoding, clearBuffer) {
		if (typeof this.fd !== 'number') {
			return this.once('open', () => this._write(chunk, encoding, clearBuffer))
		}
		fs.write(this.fd, chunk, 0, chunk.length, this.pos, (err, written) => {
			this.pos += written
			this.len -= written
			clearBuffer()
		});
	}
	end(data) {
		this.write(data, 'utf8')
	}
}

// 分片删除
// 1G

// 1G / 100 / 1m => blob截取
// fd => xhr.onprogess