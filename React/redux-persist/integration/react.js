import React,{Component} from 'react';
class PersistGate extends Component{
    componentDidMount(){
        //原来就是从localStorage里获得数据，然后同步到仓库中去 
        this.props.persistor.initState();
    }
    render(){
        return this.props.children;
    }
}

export { PersistGate };