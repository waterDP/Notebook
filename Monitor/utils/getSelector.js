/*
 * @Author: water.li
 * @Date: 2022-04-16 20:38:02
 * @Description: 
 * @FilePath: \note\Monitor\utils\getSelector.js
 */

function getSelectors(path) {
	return path.reverse().filter(element => { // 过滤document与window
		return element !== document && element !== window
	}).map(element => {
		let selector = ""
		if (element.id) {
			return `${element.nodeName.toLowerCase()}#${element.id}`
		}
		if (element.className && typeof element.className === 'string') {
			return `${element.nodeName.toLowerCase()}.${element.className}`
		}

		selector = element.nodeName.toLowerCase()
		return selector
	}).join(' ')
}
export default function (pathsOrTarget) {
	if (Array.isArray(pathsOrTarget)) { 
		// 可能是一个数组
		return getSelectors(pathsOrTarget);
	} else {
		// 也有可能是一个对象 
		let path = []
		while (pathsOrTarget) {
			path.push(pathsOrTarget)
			pathsOrTarget = pathsOrTarget.parentNode
		}
		return getSelectors(path)
	}
}