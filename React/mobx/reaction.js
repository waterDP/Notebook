/*
 * @Author: water.li
 * @Date: 2022-08-03 20:14:23
 * @Description: 
 * @FilePath: \note\React\mobx\reaction.js
 */
import { globalState } from './utils'

export default class Reaction {
  constructor(name, onInvalidate) {
    this.name = name
    this.onInvalidate = onInvalidate
    this.observing = [] // 表示它观察到了哪些可观察变量
  }
  track(fn) {
    globalState.trackingDerivation = this
    fn.call()
    globalState.trackingDerivation = null
    bindDependencies(this)
  }
  schedule() {
    globalState.pendingReactions.push(this)
    runReactions()
  }
  runReaction() {
    this.onInvalidate()
  }
}

function bindDependencies(derivation) {
  const { observing } = derivation
  observing.forEach(observableValue => {
    observableValue.observers.add(derivation)
  })
}

function runReactions() {
  const allReactions = globalState.pendingReactions
  let reaction
  while (reaction = allReactions.shift()) {
    reaction.runReaction()
  }
}