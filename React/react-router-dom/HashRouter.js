import React from 'react';
import Context from './context';
export default class HashRouter extends React.Component{
    state = {
        location:{pathname: window.location.hash.slice(1),state:null}
    }
    locationState=null
    componentDidMount(){
        window.location.hash = window.location.hash||'/';//默认值就是/
        window.addEventListener('hashchange',()=>{
            this.setState({
                location:{
                    ...this.state.location,
                    pathname:window.location.hash.slice(1),
                    state:this.locationState
                }
            });
        });
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
                        that.locationState = state;
                        window.location.hash = pathname;
                    }else{
                        that.locationState = null;
                        window.location.hash = to;
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