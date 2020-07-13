import React from 'react'
import Route from './Route';

export default function(WrappedComponent){
    return props=><Route component={WrappedComponent}/>
}