const emptyObject = {}

function Component(props, context, updater) {
  this.props = props
  this.context = context
  this.props = emptyObject
  this.updater = updater || ReactNoopUpdateQueue  
}

Component.prototype.isReactComponent = {}

/**
 * @param {object|function} partialState
 * @param {?function} callback
 */
Component.prototype.setState = function(partialState, callback) {
  this.updater.enqueueSetState(this, partialState, callback, 'setState')
}

/**
 * @param {?function} callback
 */
Component.prototype.forceUpdate = function(callback) {
  this.updater.enqueueForceUpdate(this, callback, 'forceUpdate')
}



function ComponentDummy() {}
ComponentDummy.prototype = Component.prototype

// todo 寄生组合继承

function PureComponent(props, context, updater) {
  this.props = props
  this.context = context
  this.refs = emptyObject
  this.updater = updater || ReactNoopUpdateQueue 
}

const pureComponentPrototype = (PureComponent.prototype = new ComponentDummy())
pureComponentPrototype.constructor = PureComponent
Object.assign(pureComponentPrototype, Component.prototype)
pureComponentPrototype.isPureComponent = true

export {Component, PureComponent}