import React from 'react';
import ReactDOM from 'react-dom';
import {combineReducers,createStore,applyMiddleware} from 'redux';
import {Provider,connect} from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import * as sagaEffects from 'redux-saga/effects';
import {createHashHistory} from 'history';
import {
    routerMiddleware,//创建router中间件
    connectRouter,//用来创建router reducer
    ConnectedRouter,//取代Router
} from 'connected-react-router';
export {connect};
export default function(options){
   const app = {
       _models:[],//定义的模型
       model,//添加模型的方法
       _router:null,//存放路由定义的函数
       router,
       start
   }
   function model(model){
      app._models.push(model);
   }
   function router(routeConfig){
      app._router = routeConfig;
   }
   app.use = function(plugin){
       options = {...options,...plugin};
   }
   function start(containerId){
       let history = options.history||createHashHistory();
       let reducers = {
           router:connectRouter(history)//是用来把路径路径信息同步到仓库中去的
       };
       if(options.extraReducers){
            reducers = {...reducers,...options.extraReducers}
       }
       for(let i=0;i<app._models.length;i++){
           let model = app._models[i];
           reducers[model.namespace] = function(state=model.state,action){
               let actionType = action.type;//取得动作类型 'counter/add'
               let [namespace,type] = actionType.split('/');
               if(typeof type === 'undefined'){
                    type=namespace;
                    namespace=model.namespace;
               }
               if(model.namespace === namespace){
                   let reducer = model.reducers[type];
                   if(reducer){
                        return reducer(state,action);
                   }
               }
               return state; 
           }
       }
       let finalReducer = combineReducers(reducers);
       let rootReducer = function(state,action){
         let newState = finalReducer(state,action);
         options.onStateChange&&options.onStateChange(newState);
         return newState;
       }
       if(options.onReducer){
           rootReducer = options.onReducer(rootReducer);
       }
       let sagaMiddleware = createSagaMiddleware();
       if(options.onAction){
           if(typeof options.onAction =='function'){
              options.onAction=[ options.onAction];
           }
       }else{
           options.onAction=[];
       }
     /*   if(options.extraEnhancers){//redux-persist
        createStore = options.extraEnhancers(createStore);
       } */
       let store = createStore(rootReducer,options.initialState||{},applyMiddleware(
           routerMiddleware(history),sagaMiddleware,...options.onAction));
        app._store=store;
       for(const model of app._models){
           if(model.subscriptions){
                for(const key in model.subscriptions){
                   model.subscriptions[key]({history,dispatch:store.dispatch});
              }
           }
        }
       function *rootSaga(){
           const {takeEvery}= sagaEffects;
           for(const model of app._models){
              
               const effects = model.effects;
               for(const key in effects){//key = asyncAdd 
                   //监听每一个动作，当动作发生的时候，执行对应的SAGA
                    yield takeEvery(`${model.namespace}/${key}`,function* (action){
                        try{
                            // onEffect:(effect,{put},model,actionType)
                            let effect = effects[key];
                            if(options.onEffect){
                                effect =options.onEffect(effect,sagaEffects,model,action.type);
                            }    
                            yield effect(action,sagaEffects);
                        }catch(error){
                            options.onError&&options.onError(error);
                        }
                    });
               }

           }
       }
       sagaMiddleware.run(rootSaga);
       let App = app._router({history});
       ReactDOM.render(
           <Provider store={store}>
              <ConnectedRouter history={history}>
              {App}
              </ConnectedRouter>
           </Provider>,document.querySelector(containerId)
       );
   }
    return app;
}

           /**
           {
            namespace:'counter',
            state:{number:0},
            reducers:{
                add(state){
                    return {number:state.number+1};
                },
                minus(state){
                    return {number:state.number-1};
                }
            }
        } */
