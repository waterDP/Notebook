// todo LRU缓存淘汰策略
/**
 * 缓存在计算机网络中随处可见，例如：当我们首次访问一个网络时，打开很慢，但当我们再次打开这个网页时，打开就很快
 * 这涉及在缓存在浏览器上的应用，浏览器缓存。
 * 当我们打开一个网页时，他会在发起真正的网络请求前，查询浏览器缓存，看是否要请求的文件。
 * 如果有，浏览器会拦截请求，返回缓存文件，并直接结束请求，不会再去服务器上下载。
 * 如果不存在，才会去服务器请求
 * 
 * 其实，浏览器中的缓存是一种在本地保存资源副本，它的大小是有限的，当我们请求数据时，缓存空间会被占满。
 * 此时，继续进行网络请求就需要确定缓存中哪些数据被保留，哪些数据被移除，这就是浏览器缓存淘汰机制。
 * 最常见的淘汰策略有FIFO（先进先出），LFU（最少使用）、LRU（最近最少使用）
 * 
 * LRU缓存淘汰策略顾名思义，就是根据数据的历史访问记录进行淘汰数据，
 * 其核心思想是如果数据最近被访问过，那么将来被访问的几率也更高
 * 优先淘汰最近没有被访问过的数据
 */

import { getFirstComponentChild } from "../vue源码/core/vdom/helpers"

// todo 从源码看keep-alive
export default {
  name: 'keep-alive',
  // 抽象组件属性，它丰组件实例建立父子关系的时候被忽略，发生在initLifecycle的过程中
  abstract: true,
  props: {
    // 存放缓存的组件
    include: patternTypes,
    // 不被缓存组件
    exclude: patternTypes,
    // 指定缓存的大小
    max: [String, Number]
  },
  created() {
    // 初始化用于存储缓存的cache对象
    this.cache = Object.create(null)
    // 初始化用于存储VNode key值的keys数组
    this.keys = []
  },
  destroyed() {
    for (const key in this.cache) {
      // 删除所有缓存
      pruneCacheEntry(this.cache, key, this.keys)
    }
  },
  mounted() {
    // 监听缓存（include）/不缓存（exclude）组件的变化
    // 在变化时，重新调整 cache
    // pruneCache：遍历 cache，如果缓存的节点名称与传入的规则没有匹配上的话，就把这个节点从缓存中移除
    this.$watch('include', val => {
      pruneCache(this, name => matches(val, name))
    })
    this.$watch('exclude', val => {
      pruneCache(this, name => !matches(val, name))
    })
  },
  render() {
    // 获取第一个元素的VNode
    const slot = this.$slots.default
    const vnode: VNode = getFirstComponentChild(slot)
    const componentOptions: ?VNodeComponentOptions = vnode && vnode.componentOptions
    if (componentOptions) {
      // name 不在include中或者在exclude中，则直接返回vnode, 否则继续进行下一次
      // check pattern
      const name: ?string = getComponentName(componentOptions)
      const { include, exclude} = this
      if (
        // not include
        (include && (!name || !matches(include, name))) ||
        (exclude && name && matches(exclude, name))
      ) {
        return vnode
      }

      const {cache, keys} = this
       // 获取键，优先获取组件的 name 字段，否则是组件的 tag
      const key: ?string =
        vnode.key == null
          ? // same constructor may get registered as different local components
            // so cid alone is not enough (#3269)
            componentOptions.Ctor.cid +
            (componentOptions.tag ? `::${componentOptions.tag}` : "")
          : vnode.key

      // --------------------------------------------------
      // 下面就是 LRU 算法了，
      // 如果在缓存里有则调整，
      // 没有则放入（长度超过 max，则淘汰最近没有访问的）
      // --------------------------------------------------
      // 如果命中缓存，则从缓存中获取 vnode 的组件实例，并且调整 key 的顺序放入 keys 数组的末尾
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance;
        // make current key freshest
        remove(keys, key);
        keys.push(key);
      }
      // 如果没有命中缓存,就把 vnode 放进缓存
      else {
        cache[key] = vnode
        keys.push(key);
        // prune oldest entry
        // 如果配置了 max 并且缓存的长度超过了 this.max，还要从缓存中删除第一个
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode);
        }
      }
      
      // keepAlive标记位
      vnode.data.keepAlive = true    
    }
    return vnode||(slot && slot[0])
  }
}
// 移除 key 缓存
function pruneCacheEntry (
  cache: VNodeCache,
  key: string,
  keys: Array<string>,
  current?: VNode
) {
  const cached = cache[key]
  if (cached && (!current || cached.tag !== current.tag)) {
    cached.componentInstance.$destroy()
  }
  cache[key] = null
  remove(keys, key)
}
// remove 方法（shared/util.js）
/**
 * Remove an item from an array.
 */
export function remove (arr: Array<any>, item: any): Array<any> | void {
  if (arr.length) {
    const index = arr.indexOf(item)
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}