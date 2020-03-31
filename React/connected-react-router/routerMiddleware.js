import {CALL_HISTORY_METHOD} from './constants';
export default function(history){
  return ({dispatch,getState})=>next=>action=>{
    if(action.type === CALL_HISTORY_METHOD){
      let {method,path} = action.payload;
      history[method](path);
    }else{
      next(action);
    }
  }
}