import React, { Component } from 'react';

class PersistGate extends Component {
    componentDidMount() {
        let {initState} = this.props.persistor;
        initState();
    }
    render() {
        return this.props.children;
    }
}

export {
    PersistGate
}