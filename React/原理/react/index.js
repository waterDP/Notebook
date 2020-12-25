import { createElement } from './ReactElement'
import { Component } from './ReactBaseClasses'
import { createRef } from './ReactCreateRef'
import { createContext } from './ReactContext'
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
  Component
}