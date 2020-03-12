/** 
 * promisify 
 * @param {function} fn
 * @return {function} 
 */
function promisify(fn) {
	return function (...args) {
		return new Promise((resolve, reject) => {
			fn(...args, (err, data) => {
				if (err) reject(err)
				resolve(data)
			})
		})
	}
}