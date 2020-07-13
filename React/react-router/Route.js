import React from 'react';
import RouterContext from './context';
import pathToRegexp from 'path-to-regexp';
export default class Route extends React.Component{
    static contextType = RouterContext
    render(){
        let {pathname} = this.context.location;
        let {path='/',component:Component,exact=false,render,children} = this.props;
        let paramNames = [];
        let regxp = pathToRegexp(path,paramNames,{end:exact});
        let result = pathname.match(regxp);
        let props = {
            location:this.context.location,
            history:this.context.history
        }
        if(result){
            paramNames = paramNames.map(item=>item.name);
            let [url,...values] = result;
            let params = {};
            for(let i=0;i<paramNames.length;i++){
                params[paramNames[i]] = values[i];
            }
            props.match = {
                path,
                url,
                isExact:url===pathname,
                params
            };
            if(Component){
                return <Component {...props}/>
            }else if(render){
                return render(props);
            }else if(children){
                return children(props);
            }else{
                return null;
            }
        }else{
            if(children){
                return children(props);
            }else{
                return null;
            }
        }
    }
}
