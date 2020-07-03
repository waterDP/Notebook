import tracker from '../utils/tracker'
import onload from '../utils/onload'

export function blankScreen() {
	let emptyPoints = 0
	function getSelector(element) {
		if (element.id) {
			return "#" + element.id;
		}
		if (element.className) {// a b c => .a.b.c
			return "." + element.className.split(' ').filter(item => !!item).join('.')
		} 

		return element.nodeName.toLowerCase()
	}
	function isWrapper(element) {
		const selector = getSelector(element)
		const wrapperElements = ['html', 'body', '#container', '.content']
		if (wrapperElements.indexOf(selector) != -1) {
			emptyPoints++
		}
	}
	onload(function () {
		for (let i = 1; i <= 9; i++) {
			let xElements = document.elementsFromPoint(
				window.innerWidth * i / 10, window.innerHeight / 2)
			let yElements = document.elementsFromPoint(
				window.innerWidth / 2, window.innerHeight * i / 10)
			isWrapper(xElements[0])
			isWrapper(yElements[0])
		}

		if (emptyPoints >= 18) {
			let centerElements = document.elementsFromPoint(
				window.innerWidth / 2, window.innerHeight / 2
			)
			// todo 白屏上报
			tracker.send({
				kind: 'stability',
				type: 'blank',
				emptyPoints,
				screen: window.screen.width + "X" + window.screen.height,
				viewPoint: window.innerWidth + "X" + window.innerHeight,
				selector: getSelector(centerElements[0])
			})
		}
	})
}