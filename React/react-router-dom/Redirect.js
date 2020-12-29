import React from 'react';
import RouterContext from './context';
export default class Redirect extends React.Component{
    static contextType = RouterContext
    render(){
        this.context.history.push(this.props.to);
        return null;
    }
}