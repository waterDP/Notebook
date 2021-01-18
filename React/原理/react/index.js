import { createElement } from './ReactElement'
import { Component, PureComponent } from './ReactBaseClasses'
import { createRef } from './ReactCreateRef'
import { createContext } from './ReactContext'
import { forwardRef } from './ReactForwardRef'
import {map, forEach, count, toArray, only} from './ReactChildren'

const Children = {
  map,
  forEach,
  count,
  toArray,
  only
}

export default {
  createElement,
  createRef,
  createContext,
  forwardRef,
  Component,
  PureComponent
}