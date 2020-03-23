
export default function createSagaMiddleware(){
    function createChannel(){
        let observer = {};
        function subscribe(actionType,callback){
            observer[actionType]=callback;
        }
        function publish(action){
            if(observer[action.type]){
                let next = observer[action.type];//next
                delete observer[action.type];
                next(action);

                //observer[action.type](action);//next(action);next();
                //delete observer[action.type];
            }
        }
        return {subscribe,publish};
    }
    let channel = createChannel();
    function sagaMiddleware({dispatch,getState}){
        function run(generator,callback){
            let it = typeof generator[Symbol.iterator] == 'function'?generator:generator();
            function next(action){
                // value={type:'TAKE',actionType:ASYNC_INCREMENT}
                let {value:effect,done} = it.next(action);//{value,done}
                if(!done){
                    if(typeof effect[Symbol.iterator]  == 'function'){
                        run(effect);//如果是一个迭代器的话直接传入run方法进行执行
                        next();
                    }else if(typeof effect.then == 'function' ){
                        effect.then(next);
                    }else{
                        switch(effect.type){
                            case 'TAKE': //take的意思就是要监听某个动作,当动作发生的时候执行下一步
                             channel.subscribe(effect.actionType,next); 
                             //observer[ASYNC_INCREMENT]=next
                             break;
                            case 'PUT': //{type:'PUT',action:{type:INCREMENT}}
                                dispatch(effect.action);
                                next();
                                break;
                            case 'FORK':
                                let newTask =  effect.task();
                                run(newTask);//如果是fork的话，就开启一个新的子进程去的执行
                                next(newTask);//自己的saga会立刻继续执行而不会在此等待
                                break;
                            case 'CANCEL':
                                effect.task.return('任务直接结束');
                                break;    
                            case 'CALL':
                                effect.fn(...effect.args).then(next);
                                break; 
                            case 'CPS':
                                effect.fn(...effect.args,next);
                                break;  
                            case 'ALL':
                                function times(cb,length){
                                        let count = 0;
                                        return function(){
                                            if(++count === length){
                                              cb();
                                            }
                                        }                                  
                                }
                                let fns = effect.fns;//2
                                let done = times(next,fns.length);
                                effect.fns.forEach(fn=>run(fn,done));    
                                break;     
                            default:
                                break;
                       } 
                    }
                }else{
                    callback&&callback();
                }
            }
            next();
        }
        sagaMiddleware.run =run;
        return function(next){
            return function(action){
                channel.publish(action);
                next(action);
            }
        }
    }
    return sagaMiddleware;
}