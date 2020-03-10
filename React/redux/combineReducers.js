
export default function(reducers){
  const reducerKeys = Object.keys(reducers);//['counter1','counter2']
  return function (state={},action){//state={counter1:0,counter:0}
    const nextState = {};//下一个状态对象
    for(let i=0;i<reducerKeys.length;i++){
        const key = reducerKeys[i];//counter1
        const reducer = reducers[key];//counter1
        const previousStateForKey = state[key];
        const nextStateForKey = reducer(previousStateForKey,action);
        nextState[key] = nextStateForKey;
    }
    return nextState;
  }
}

/**
let reducers = combineReducers({
    counter1,//0
    counter2//0
});
 */