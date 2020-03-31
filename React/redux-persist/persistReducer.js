const PERSIST_INIT = 'PERSIST_INIT';

export default  function persistReducer(persistConfig, reducers){
   let key = `persist:${persistConfig.key}`;
    let isInited = false;
   return function(state,action){
      switch(action.type){
        case PERSIST_INIT:
            isInited =true;
            let value = persistConfig.storage.get(key);
            state = JSON.parse(value);
            return state;
        default:
            if(isInited){
                state = reducers(state,action);
                persistConfig.storage.set(key,JSON.stringify(state));
                return state;
            }else{
                return reducers(state,action);
            }
           
      }
   }
}