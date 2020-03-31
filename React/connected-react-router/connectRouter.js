import {LOCATION_CHANGE} from './constants'
export default function(history){
  let initState = {action:history.action,location:history.location};  
  return function(state=initState,action){
     switch(action.type){
        case LOCATION_CHANGE:
          return action.payload;
        default:
          return state;  
     }
  }
}