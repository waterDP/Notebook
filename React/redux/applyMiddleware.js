import compose from './compose';
export default function applyMiddleware(...middlewares){//[thunk,logger1]
    return function(createStore){
        return function(reducer){
            let store = createStore(reducer);//这就是最原始的仓库
            let dispatch = ()=>{throw Error('现在还不能用!')};
            let middlewareAPI = {
                getState:store.getState,
                dispatch:(...args)=>dispatch(...args)
            }
            const chain = middlewares.map(middleware=>middleware(middlewareAPI));
            //[thunk,logger1,store.dispatch]
            dispatch = compose(...chain)(store.dispatch);
            return {
                ...store,
                dispatch
            };
        }
    }
}