import {CALL_HISTORY_METHOD} from 'connected-react-router';
export default function(path){  //dispath(push(path))
  return {
      type:CALL_HISTORY_METHOD,
      payload:{
          method:'push',
          path
      }
  }
}