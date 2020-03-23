import isPlainObject from "./utils/isPlainObject";
import ActionTypes from "./utils/actionTypes";

export default function createStore(reducer, preloadedState) {
	if (typeof reducer !== 'function') {
		throw new Error('reducer必须是一个函数');
	}
	let currentReducer = reducer;//当前的处理器
	let currentState = preloadedState;//当前状态
	let currentListeners = [];//定义一数组保存当前的监听函数
	function getState() {//返回当前状态
		return currentState;
	}

	function dispatch(action) {//{type:'xx'}
		if (!isPlainObject(action)) {
			throw new Error('action必须是一个纯对象');
		}
		if (typeof action.type === 'undefined') {
			throw new Error('action的type属性不能是 undefined');
		}
		currentState = currentReducer(currentState, action);
		for (let i = 0; i < currentListeners.length; i++) {
			const listener = currentListeners[i];
			listener();
		}
		return action;
	}
	function subscribe(listener) {
		let subscribed = true;
		currentListeners.push(listener);
		return function unsubscribe() {
			if (!subscribed) return;
			const index = currentListeners.indexOf(listener);
			currentListeners.splice(index, 1);
			subscribed = false;
		}
	}
	dispatch({ type: ActionTypes.INIT });
	return {
		getState,
		dispatch,
		subscribe
	}
}