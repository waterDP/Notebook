/*
 * @Author: water.li
 * @Date: 2022-08-03 18:58:35
 * @Description: 
 * @FilePath: \note\React\mobx-react\index.jsx
 */
import React, {useState} from "react"
import { Reaction, observable } from "mobx"

export function useObserver(fn) {
  const [,setState] = useState({})
  const forceUpdate = () => setState({})

  let reaction = new Reaction('observer', forceUpdate)
  let rendering
  reaction.track(() => {
    rendering = fn()
  })
  rendering
}

export function observer(oldComponent) {
  if (oldComponent.prototype && oldComponent.prototype.isReactComponent) {
    return makeClassComponentObserver(oldComponent)
  }
  let observerComponent = (props) => {
    return useObserver(() => oldComponent(props))
  }
  return observerComponent
}

function makeClassComponentObserver(ClassComponent) {
  const prototype = ClassComponent.prototype
  const originalRender = prototype.render
  prototype.render = function () {
    const boundOriginalRender = originalRender.bind(this);
    const reaction = new Reaction('render', () => React.Component.prototype.forceUpdate.call(this));
    let rendering;
    reaction.track(() => {
      rendering = boundOriginalRender();
    });
    return rendering
  }
  return ClassComponent
}

export function useLocalObservable(initializer) {
  return useState(() => observable(initializer(), {}, { autoBind: true }))[0]
}