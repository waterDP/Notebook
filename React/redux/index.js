import createStore from './createStore';
import combineReducers from './combineReducers';
import bindActionCreators from './bindActionCreators';
import applyMiddleware from './applyMiddleware';
export {
    createStore,//创建仓库
    combineReducers,//合并reducers
    bindActionCreators,//把actionCreator 和 dispatch方法绑定在一起
    applyMiddleware
}