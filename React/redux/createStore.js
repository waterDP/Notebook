import isPlainObject from "./utils/isPlainObject";
import ActionTypes from "./utils/actionTypes";

export default function createStore(reducer, initialState, enhancer) {
	if (typeof reducer !== 'function') {
		throw new Error('reducer必须是一个函数')
	}
	if (typeof initialState === 'function' && typeof enhancer === 'undefined') {
		enhancer = initialState
		initialState = undefined
	}
	if (typeof enhancer !== 'undefined') {
		return enhancer(createStore)(reducer, initialState)
	}
	let currentReducer = reducer // 当前的处理器
	let currentState = initialState // 当前状态
	let currentListeners = [] // 定义一数组保存当前的监听函数
	function getState() { // 返回当前状态
		return currentState
	}

	function dispatch(action) {//{type:'xx'}
		if (!isPlainObject(action)) {
			throw new Error('action必须是一个纯对象')
		}
		if (typeof action.type === 'undefined') {
			throw new Error('action的type属性不能是 undefined')
		}
		currentState = currentReducer( , action)  // todo 改变状态 
		currentListeners.forEach(listener => listener())  // todo 触发监听
		return action
	}
	function subscribe(listener) {
		let subscribed = true
		currentListeners.push(listener)
		return function unsubscribe() {  // todo 取消订阅
			if (!subscribed) return
			currentListeners = currentListeners.filter(item => item !== listener)
			subscribed = false
		}
	}
	dispatch({ type: ActionTypes.INIT })  // ? 这里是为了初始化状态
	return {
		getState,
		dispatch,
		subscribe
	}
}