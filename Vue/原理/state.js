import {observe} from './observer'
import {proxy} from './util/index'

export function initState(vm) {
  const opts = vm.$options
  if (opts.props) {
    initProps(vm)
  }
  if (opts.methods) {
    initMethods(vm)
  }
  if (opts.data) {
    initData(vm)
  }
  if (opts.computed) {
    initComputed(vm)
  }
  if (opts.watch) {
    initWatch(vm)
  }
}

function initProps(vm) {}

function initMethods(vm) {}

function initData(vm) {
  // 数据的初始化工作
  let data = vm.$options.data
  data = vm._data = typeof data === 'function' ? data.call(vm) : data
  for (let key in data) {
    proxy(vm, '_data', key) // 代理
  }
  observe(data)  // 对象劫持
}

function initComputed(vm) {}

function initWatch(vm) {

}