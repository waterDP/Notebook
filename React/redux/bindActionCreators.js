function bindActionCreator(actionCreator,dispatch){
    return function(){
        return dispatch(actionCreator.apply(this,arguments));
    }
}
export default function bindActionCreators(actionCreators,dispatch){
    if(typeof actionCreators == 'function'){
        return bindActionCreator(actionCreators,dispatch);
    }
    const boundActionCreators = {};
    for(const key in actionCreators){
        boundActionCreators[key] = bindActionCreator(actionCreators[key],dispatch);
    }
    return boundActionCreators;
}