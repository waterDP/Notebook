import React from 'react';
import Context from './context';
let pushState = window.history.pushState;
window.history.pushState = (state,title,url)=>{
    pushState.call(window.history,state,title,url);
    window.onpushstate.call(this,state,url);
}

export default class HashRouter extends React.Component{
    state = {
        location:{pathname:window.location.pathname,state:null}
    }
    componentDidMount(){
      window.onpopstate = (event)=>{
        if(this.block){
            let confirm = window.confirm(this.block(this.state.location));
            if(!confirm) return;
        }
        this.setState({
            location:{
                ...this.state.location,
                pathname:window.location.pathname,
                state:event.state
            }
        });
      }
      window.onpushstate = (state,pathname)=>{
        this.setState({
            location:{
                ...this.state.location,
                pathname,
                state
            }
        });
      }
    }
    
    render(){
        let that = this;
        let value = {
            location:that.state.location,
            history:{
                push(to){//定义一个history对象，有一个push方法用来跳路径
                    if(that.block){
                        let confirm = window.confirm(that.block(typeof to === 'object'?to:{pathname:to}));
                        if(!confirm) return;
                    }
                    if(typeof to === 'object'){
                        let {pathname,state} = to;
                        //that.locationState = state;
                        //window.location.hash = pathname;
                        window.history.pushState(state,'',pathname);
                    }else{
                        //that.locationState = null;
                        //window.location.hash = to;
                        window.history.pushState(null,'',to);
                    }
                },
                block(message){
                    that.block = message;
                }
            }
        }
        return (
            <Context.Provider value={value}>
                {this.props.children}
            </Context.Provider>
        )
    }
}