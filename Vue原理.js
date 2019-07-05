=> 变化侦听
	
	<Object的变化侦测>
	function defineReactive(data, key, val) {
		let dep = [];
		Object.defineProperty(data, key, {
			enumerable: true, // 可枚举
			configurable: true, // 可修改
			get() {
				dep.push(window.target);
				return val;
			},
			set(newVal) {
				if (val === newVal) {
					return;
				}
				dep.forEach(d => d[newVal, val])
				val = newVal;
			}
		})
	}

	Object 在getter中收集依赖，在setter中触发依赖。


	这里我们新增了数组dep,用来存储被被收集的依赖。然后在set被触发时，循环dep以触发收集的依赖。
	但是这样写有点耦合，我们把依赖收集的代码封装成一个Dep类，它专门帮助我们管理依赖。使用这个类，我们可以收集依赖、删除依赖或者向依赖发送通知等。

	export default class Dep {
		constructor() {
			this.subs = [];
		}

		addSub (sub) {
			this.subs.push(sub);
		}

		depend() {
			if (window.target) {
				this.addSub(window.target);
			}
		}

		notify() {
			const subs = this.subs.slice();
			subs.forEach(sub => sub.update());
		}
	}

	function remove(arr, item) {
		if (arr.length) {
			const index = arr.indexOf(item);
			if (index > -1) {
				return arr.splice(index, 1);
			}
		}
	}

	之后再改造一下defineReactive:
	function defineReactive(data, key, val) {
		let dep = new Dep();
		Object.defineProperty(data, key, {
			enumerable: true,
			configurable: true,
			get() {
				dep.depend();
				return val;
			},
			set() {
				if (val === newVal) {
					return;
				}
				val = newValue;
				dep.notify();
			}
		});
	}

	> Watcher
	export default class Watcher {
		constructor(vm, expOrFn, cb) {
			this.vm = vm;
			this.getter = parsePath(expOrFn);
			this.cb = cb;
			this.value = this.get();
		}

		get() {
			window.target = this;
			let value = this.getter.call(this.vm, this.vm);
			window.target = undefined;
			return value;
		}

		update() {
			const oldValue = this.value;
			this.value = this.get();
			this.cb.call(this.vm, this.value, oldValue);
		}
	}

	> 递归侦测所有Key
	现在，其实已经可以实现变化侦测的功能了，但是前面介绍的代码只能侦测数据中的某一个属性，我们希望把所有属性（包括子属性）都侦测到时，所以要封装一个Observer类。这个类的作用是将一个数据内的所有属性（包括子属性）都转换成getter/setter的形式，然后去追踪它们的变化。
	/**
	 * Observer类会附加到每一个被侦测的object上
	 * 一旦被附加上，Observer会将object上的所有属性转换成getter/setter的形式
	 * 来收集属性的依赖，并且当属性发生变化时会通知这些属性
	 */
	export class Observer {
		constructor(value) {
			this.value = value;

			if (！Array.isArray(value)) {
				this.walk(value);
			}
		}
		/**
		 * walk会将每一个属性都转换成getter/setter的形式来侦测变化
		 * 这个方法只有在数据类型为Object时被调用
		 */
		walk(obj) {
			const keys = Object.keys(obj);
			for (let i = 0; i < keys.length; i++) {
				definedReactive(obj, keys[i], obj[keys[i]]);
			}
		}
	}

	function defineReactive(data, key, val) {
		// 新增，递归子属性
		if (typeof val === 'object') {
			new Observer(val);
		}

		let dep = new Dep();
		Object.definedProperty(data, key, {
			enumerable: true,
			configurable: true,
			get() {
				dep.depend();
				return val;
			}
			set(newVal) {
				if (val === newVal) {
					return;
				}
				val = newVal;
				dep.notify();
			}
		});
	}

	<Array的变化侦测>
	> 拦截器
	const arrayProto = Array.prototype;
	export const arrayMethods = Object.create(arrayProto);

	[
		'push',
		'pop',
		'shift',
		'unshift',
		'splice',
		'sort',
		'reverse'
	].forEach(method => {
		// 缓存原始方法
		const original = arrayProto[method];
		Object.definedProperty(arrayMethods, method, {
			value: function mutator(...args) {
				return original.apply(this, args);
			},
			enumerable: true, // 可枚举
			writable: true,
			configurable: true
		});
	});

	> 使用拦截器覆盖Array原型
	有了拦截器之后，想要让它生效，就需要它去覆盖Array.prototype。但是我们又不能直接覆盖，因为这样会污染全局的Array，这并不是我们希望看到的结果。我们希望拦截的操作只针对那些侦测了变化的数据生效，也就是说希望拦截器只覆盖那些响应式数组的原型。

	// __proto__ 是否可用
	const hasProto = '__proto__' in {}
	const arrayKeys = Object.getOwnPrototypeNames(arrayMethods);
	export class Observer {
		constructor(value) {
			this.value = value;
			this.dep = new Dep();
			def(value, '__ob__', this);

			if (Array.isArray(value)) {
				const augment = hasProto ? protoAugment : copyAugment;
				augument(value, arrayMethods, arrayKeys);
			} else {
				this.walk(value);
			}
		}
	}

	function protoAugment(target, src, keys) {
		target.__proto__ = src;
	}

	function copyAugment(target, src, keys) {
		for (let i = 0; i < keys.length; i++) {
			const key = key[i];
			def(target, key, src[key]);
		} 
	}

	Array 在getter中收集依赖，在拦截器触发依赖。

	function definedReactive(data, key, val) {
		if (typeof val === 'object') new Observer(val);
		let childOb = observe(value);
		let dep = new Dep();
		Object.definedProperty(data, key, {
			enumerable: true,
			configurable: true,
			get() {
				dep.depend();
				// 这里收集Array依赖
				// 
				if(childOb) {
					childOb.dep.depend();
				}
				return val;
			},
			set(newVal) {
				if (val === newVal) {
					return;
				}

				dep.notify();
				val = newVlaue;
			}
		}); 
	}

	/**
	 * 尝试为value创建一个Observer实例
	 * 如果创建成功，直接返回新创建的Observer实例
	 * 如果value已经存在一个Observer实例，则直接返回它
	 */
	export function observe(value, asRootData) {
		if (!isObject(value)) {
			return;
		}
		let ob;
		if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
			ob = value.__ob__;
		} else {
			ob = new Observer(value);
		}

		return ob;
	}

	> 在拦截器中获取Observer实例
	// 工具函数
	function def(obj, key, val, enumerable) {
		Object.defineProperty(obj, key, {
			value: val,
			enumerable: !!enumberable,
			writable: true,
			configurable: true 
		})
	}

	<变化侦测相关的API实现原理>
	> vm.$watch
	Vue.prototype.$watch = function(expOrFn, cb, options) {
		const vm = this;
		options = options || {};
		const watcher = new Watcher(vm, expOrFn, cb, options);
		if (options.immeiate) {
			cb.call(vm, watcher.value);
		}
		return function unwatchFn() {
			watcher.teardown();
		} 
	}

	export default class Watcher {
		constructor(vm, expOrFn, cb) {
			this.vm = vm;
			// expOrFn参数支持函数 
			if (typeof expOrFn === 'function') {
				this.getter = expOrFn;
			} else {
				this.getter = parsePath(expOrFn);
			}
			this.cb = cb;
			this.value = this.get(); 
		}
	}

	export default class Watcher {
		constructor(vm, expOrFn, cb) {
			this.vm = vm;
			this.deps = []; // 新增
			this.depIds = new Set(); // 新增
			this.getter = parsePath(expOrFn);
			this.cb = cb;
			this.value = this.get();
		}

		addDep(dep) {
			const id = dep.id;
			if (!this.depIds.has(id)) {
				this.depIds.add(id);
				this.deps.push(dep);
				dep.addSub(this);
			}
		}
	}


	// p34

=> 虚拟DOM
	export default class VNode {
	  tag: string | void;  // 元素节点的名称
	  data: VNodeData | void;
	  children: ?Array<VNode>;  // 子节点
	  text: string | void;  // 文本节点的文本
	  elm: Node | void;
	  ns: string | void;
	  context: Component | void; // rendered in this component's scope
	  key: string | number | void;
	  componentOptions: VNodeComponentOptions | void;
	  componentInstance: Component | void; // component instance
	  parent: VNode | void; // component placeholder node

	  // strictly internal
	  raw: boolean; // contains raw HTML? (server only)
	  isStatic: boolean; // hoisted static node
	  isRootInsert: boolean; // necessary for enter transition check
	  isComment: boolean; // empty comment placeholder?
	  isCloned: boolean; // is a cloned node?
	  isOnce: boolean; // is a v-once node?
	  asyncFactory: Function | void; // async component factory function
	  asyncMeta: Object | void;
	  isAsyncPlaceholder: boolean;
	  ssrContext: Object | void;
	  fnContext: Component | void; // real context vm for functional nodes
	  fnOptions: ?ComponentOptions; // for SSR caching
	  devtoolsMeta: ?Object; // used to store functional render context for devtools
	  fnScopeId: ?string; // functional scope id support

	  constructor (
	    tag?: string,
	    data?: VNodeData,
	    children?: ?Array<VNode>,
	    text?: string,
	    elm?: Node,
	    context?: Component,
	    componentOptions?: VNodeComponentOptions,
	    asyncFactory?: Function
	  ) {
	    this.tag = tag
	    this.data = data
	    this.children = children
	    this.text = text
	    this.elm = elm
	    this.ns = undefined
	    this.context = context
	    this.fnContext = undefined
	    this.fnOptions = undefined
	    this.fnScopeId = undefined
	    this.key = data && data.key
	    this.componentOptions = componentOptions
	    this.componentInstance = undefined
	    this.parent = undefined
	    this.raw = false
	    this.isStatic = false
	    this.isRootInsert = true
	    this.isComment = false
	    this.isCloned = false
	    this.isOnce = false
	    this.asyncFactory = asyncFactory
	    this.asyncMeta = undefined
	    this.isAsyncPlaceholder = false
	  }

	  // DEPRECATED: alias for componentInstance for backwards compat.
	  /* istanbul ignore next */
	  get child(): Component | void {
	    return this.componentInstance
	  }
	}

	<VNode> 的类型
		注释节点
		文本节点
		元素节点
		组件节点
		函数式节点
		克隆节点

	. 注释节点
		export const createEmptyVNode = text => {
			const node = new VNode();
			node.text = text;
			node.isComment = true;
			return node;
		}	
		可以看出，一个注释节点只有两个有效属性——text和isComment，其余属性全是默认的undefined 或者 false;

	. 文本节点
		export function createTextVNode(val) {
			return new VNode(undefined, undefined, undefined, String(val));
		}	

	. 克隆节点
		克隆节点是将现有节点属性复制到新的节点中，让新创建的节点和被克隆的节点的属性保持一致，从而实现克隆效果。它的作用是优化静态节点和插槽节点（slot node）。	
		export function cloneVNode(vnode, deep) {
			const cloned = new VNode(
				vnode.tag,
				vnode.data,
				vnode.children,
				vnode.text,
				vnode.elm,
				vnode.context,
				vnode.componentOptions,
				vnode.asyncFactory
			);
			cloned.ns = vnode.ns;
			cloned.key = vnode.key;
			cloned.isComment = vnode.isComment;
			cloned.isCloned = true;
			if (deep && vnode.children) {
				clone.children = cloneVNodes(vnode.children);
			}
			return cloned;
		}

		.元素节点
			元素节点有以下4个属性
				.tag: 顾名思义，tag就是一个节点的名称。例如p、ul、li和div等；
				.data: 该属性包含了一些节点上的数据，比如attrs、class和style等；
				.children: 当前节点的子节点列表；
				.context: 它是当前组件的Vue实例；

		.组件节点
			组件节点和元素节点类似，有以下两个独有的属性。
				.componentOptions: 顾名思义，就是组件节点的选项参数，其中包含propsData、tag和children等信息；
				.componentInstance: 组件的实例，也是Vue实例。事实上，在Vue中，每个组件都是一个Vue实例；

		.函数式组件
			函数式组件和组件节点类似，它有两个独有的属性functionContext和functionalOptions。

	<patch>
		只有三种类型的节点会被创建并插入到DOM中：元素节点、注释节点和文本节点。

		一个元素节点从创建到渲染视图的过程
		创建节点 >> 创建元素节点 >> 创建子节点 >> 插入到parentNode中

		> 删除节点
		function removeVnodes(vnodes, startIdx, endIdx) {
			for (; startIdx <= endIdx; ++startIdx) {
				const ch = vnodes[startIdx];
				if (isDef(ch)) {
					removeNode(ch.elm);
				}
			}
		}

		removeNode用于删除视图中的单个节点，而removeVnodes用于删除一组指定的节点

		const nodeOps = {
			removeChild(node, child) {
				node.removeChild(child)
			}
		}

		function removeNode(el) {
			const parent = nodeOps.parentNode(el);
			if (isDef(parent)) {
				nodeOps.removeChild(parent, el);
			}
		}

=> 模板编译原理
	将模板编译成渲染函数可以分两个步骤，先将模板解析成AST,然后再使用AST生成渲染函数。
	三个部分
	1.将模拟解析为AST       解析器
	2.遍历AST标记静态节点   优化器  
	3.使用AST生成渲染函数   代码生成器

	<解析器> parse

	declare type ASTElement = {
		type: 1;
		tag: string;
		attrsList: Array<{name: string; value: string}>;
		attrMap: ASTElement | void;
		children: Array<ASTNode>;
		// ...
	}

	declare type ASTExpression = {
		type: 2;
		expression: string;
		text: string;
		static?: boolean;
	}

	declare type ASTText = {
		type: 3;
		text: string;
		static?: boolean;
	}

	// parse 里定义的一些正则
	export const onRE = /^@|^v-on:/; // 匹配 v-on
	export const dirRE = /^v-|^@|^:/; // 匹配 v-on和
	export const forAliacRE = /(.*?)\s+(?:in|of)\s+(.*)/; // 匹配 v-for 属性
	export const forIteratorRE = /\((\{[^}]*\}|[^,]*),([^,]*)(?:,([^,]*))?\)/; // 匹配 v-for 的多种形式

	/**
	 * @example
	 * <div id="test">texttext</div>
	 */
	ele1 = {
    type: 1,
    tag: "div",
    attrsList: [{name: "id", value: "test"}],
    attrsMap: {id: "test"},
    parent: undefined,
    children: [{
        type: 3,
        text: 'texttext'
      }
    ],
    plain: true,
    attrs: [{name: "id", value: "'test'"}]
  }

  <优化器> optimize
  /**
   * 在第二步中，会对parse生成的AST进行静态内容的优化。静态内容指的和数据没关系，
   * 不需要每次都刷新的内容。标记静态节点的作用是为了在后面做Vnode的diff时起作用，
   * 用来确认一个节点应该做patch还是直接跳过。optimize的过程分两步：
   * 	1.标记所有静态和非静态结点
   * 	2.标记静态根节点
   */
  
  /*标记所有的静态和非静态结点*/
  function markStatic(node: ASTNode) {
  	// 标记static属性
  	/**
	   * isStatic 函数顾名思义是判断该节点是否static的函数，符合以下内容的节点就会被认为是static的节点
	   * 1.如果是表达式AST节点，直接返回false;
	   * 2.如果是文本AST节点，直接返回true;
	   * 3.如果元素是元素节点，阶段有v-pre 指令 ||
	   * 	.没有任何指令、数据绑定、事件绑定 &&
	   * 	.没有v-if 和 v-for
	   * 	.不是slot和component &&
	   * 	.是HTML保留标签 &&
	   * 	.不是template标签直接子元素并且没有包含在for循环中
	   * 则返回true
	  */
  	node.static = isStatic(node);

  	if (node.type === 1) {
  		/**
  		 * if 判断条件
  		 * !isPlatformReservedTag(node.tag) node.tag不是HTML保留标签时返回true
  		 * node.tag !== 'slot' 标签不是slot
  		 * node.attrsMap['inline-template'] === null node不是一个内联模板容器
  		 */
  		if (
  			!isPlatformReservedTag(node.tag) &&
  			node.tag !== 'slot' &&
  			node.attrsMap['inline-template'] === null
  		) {
  			return;
  		}
  	}
  	for (let i = 0, l = node.chilren.length; i < l; i++) {
  		const child = node.children[i];
  		markStatic(child);
  		if (!child.static) {
  			node.static = false;
  		}
  	}
  }

  如果满足上面的所有条件，那么这个节点的static就会被置为false并且不递归子元素，当不满足上面某一个条件时，递归子元素判断子元素是否static，只有所有元素都是static的时候，该元素才是static;


  /*标记静态根节点*/
  if (node.static && node.children.length && (
  	node.children.length === 1 &&
  	node.children[0].type === 3
  )) {
  	node.staticRoot = true;
  	return;
  } else {
  	node.staticRoot;
  }

=> 整体流程	

	import {initMixin} from "./init";
	import {stateMixin} from "./state";
	import {renderMixin} from "./render";
	import {eventsMixin} from "./events";
	import {liftcycleMixin} from "./lifecycle";
	import {warn} from "../util/index";

	function Vue(options) {
		if (process.env.NOD_ENV !== 'production' &&
			!(this instanceof Vue)) {
			warn('Vue is a constructor and should be called with the `new` keyword');
		}
		this._init(options);
	}

	initMixin(Vue);
	stateMixin(Vue);
	eventsMixin(Vue);
	lifecycleMixin(Vue);
	renderMixin(Vue);

	export default Vue;

	实例方法 与 全局API的实现

	export function initMinxin(Vue) {
		Vue.prototype._init = function(options) {
			// todo: 
		}
	}

	<数据相关的实例方法>
	与数据相关的实例方法有3个，分别是vm.$watch/vm.$set/vm.$delete, 它们是在stateMixin中挂载到Vue的原型上的，代码如下
	import {
		set,
		del
	} from "../observer/index";

	export function stateMixin(Vue) {
		Vue.prototype.$set = set;
		Vue.prototype.$del = del;
		Vue.prototype.$watch = function(expOrFn, cb, options) {};
	}

	<事件相关的实例方法>
	与事件相关的实例方法有4个，分别是vm.$on/vm.$once/vm.$off/vm.$emit。这4个方法是在eventsMixin中挂载到Vue构造函数的prototype属性中的，其代码也下：
	export function eventsMixin(Vue) {
		Vue.prototype.$on = function(event, fn) {
			// todo: 
			const vm = this;
			if (Array.isArray(event)) {
				for (let i = 0, l = event.length; i < l; i++) {
					this.$on(event[i], fn);
				}
			} else {
				(vm._events[event] || (vm._events[event] = [])).push(fn);
			}
			return vm;
		}

		Vue.prototype.$once = function(event, fn) {
			// todo:
			const vm = this;
			function on() {
				vm.$off(event, on);
				fn.apply(vm, arguments);
			}
			on.fn = fn;
			vm.$on(event, on);
			return vm;
		}

		Vue.prototype.$off = function(event, fn) {
			// todo:
			const vm = this;
			// 移除所有事件的监听器
			if (!arguments.length) {
				vm._events = Object.create(null);
				return vm;
			}
			// event 支持数组
			if (Array.isArray(event)) {
				for (let i = 0, l = event.length; i < l; i++) {
					this.$off(event[i], fn);
				}
				return vm;
			}

			const cbs = vm._events[event];
			if (!cbs) {
				return vm;
			}
			// 移除该事件上的所有监听
			if (arguments.length === 1) {
				vm._events[event] = null;
				return vm;
			}

			// 只移除与fn相同的监听器
			if (fn) {
				const cbs = vm._events[events];
				let cb;
				let i = cbs.length;
				while(i--) {
					cb = cbs[i];
					if (cb ===  fn || cb.fn === fn) {
						cbs.splice(i, 1);
						break;
					}
				}
			}
			return vm;
		} 

		Vue.prototype.$emit = function(event) {
			// todo: 
			const vm = this;
			let cbs = vm._events[event];
			if (cbs) {
				const args = toArray(arguments, 1);
				for (let i = 0, l = cbs.length; i < l; i++) {
					try {
						cbs[i].apply(vm, args);
					} catch(e) {
						handleError(e, vm, `event handler for "${event}"`);
					}
				}
			}
			return vm;
		}
	}

	vm.$off([event, callback]);
	用法：
		.如果没有提供参数，则移除所有的事件监听器；
		.如果只提供了事件，则移除该事件所有的监听器；
		.如果同时提供了事件和回调，则只移除这个回调的监听器；


	<生命周期相关的实例方法>	
	与生命周期相关的函数有4个，分别是vm.$mount/vm.$forceUpdate/vm.$nextTick/vm.$destroy。其中有两个方法是从lifecycleMixin中挂载到时Vue构造函数的prototype属性上的，分别是vm.$forceUpdate 和
	vm.$destory。 lifecycleMixin代码如下
	export function lifecycleMxin(Vue) {

		Vue.prototype.$foreUpdate = function () {
			// todo:
			const vm = this;
			if (vm._watcher) {
				vm._watcher.update();
			}
		}

		Vue.prototype.$destory = function () {
			// todo: 
			const vm = this;
			if (vm._isBeingDetoryed) {
				return;
			}
			callHook(vm, 'beforDestroy');
			vm._isBeingDetoryed = true;

			// 删除自己与父级之间的连接
			/**
			 * 如果当前实例有父级，同时父级没有被销毁且不是抽象组件，那么将自己从父级的子级列表中的删除，
			 * 也就是将自己的实例从父级的$children属性中删除-
			 */
			const parent = vm.$parent;
			if (parent && !parent._isBeingDetoryed && !vm.$options.abstract) {
				remove(parent.$children, vm);
			}
			// 从watcher监听的所有状态的依赖列表中移除watcher
			if (vm._watcher) {
				vm._watcher.teardown();
			}
			let i = vm._watchers.length;
			while(i--) {
				vm._watchers[i].teardown();
			}
			vm._isDestroyed = true;
			// 在vnode树上触发destory钩子函数解绑指令、
			vm.__patch__(vm._vnode, null);
			// 触发destoryed钩子函数
			callHook(vm., 'destroyed');
			// 移除所有的事件监听
			vm.$off();
		}
	}

	Vue实例的$children 属性存储了所有子组件
	// 删除自己与父级之间的连接
	const parent = vm.$parent;
	if (parent && !parent._isBeingDetoryed && !vm.$options.abstract) {
		remove(parent.$child, vm);
	}

	export function remove (arr, item) {
		if (arr.length) {
			const index = arr.indexOf(item);
			if (index > -1) {
				return arr.splice(index, 1);
			}
		}
	}

	<vm.$nextTick()>
	/**
	 * 由于vm.$nextTick会将回调添加到任务队列中延迟执行，所以在回调执行前，如果反复调用vm.$nextTcik，Vue
	 * 并不会反复将架回调添加到时任务队列中，只会向任务队列中添加一个任务。
	 * 此外，Vue内部有一个列表来存储vm.$nextTick参数中提供的回调。在一轮事件循环中，vm.$nextTick只会向
	 * 任务队列添加一个任务，多次使用vm.$nextTick只会将回调添加到回调列表中缓存起来。当任务触发时，依次执行
	 * 列表中的所有回调并清空列表。
	 */
	const callbacks = [];
	let pending = false;

	function flushCallbacks () {
		pending = false;
		const copies = callbacks.slice(0);
		callbacks.length = 0;
		for (let i = 0; i < copies.length; i++) {
			copies[i]();
		}
	}

	let microTimerFunc;
	let macroTimerFunc;
	let useMacroTask = false;

	if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
		macroTimerFunc = () => {
			setImmediate(flushCallbacks);
		};
	} else if (typeof MessageChannel !== 'undefined' && (
			isNative(MessageChannel) ||
			MessageChannel.toString() === '[object MessageChannelConstructor]';
	)) {
		const channel = new MessageChannel();
		const port = channel.port2;
		chaneel.port1.onmessage = flushCallbacks;
		macroTimerFunc = () => {
			port.postMessage(1);
		}
	} else {
		macroTimerFunc = () => {
			setTimeout(flushCallbacks, 0);
		}
	}

	if (typeof Promise !== 'undefined' && isNative(Promise)) {
		const p = Promise.resolve();
		microTimerFunc = () => {
			p.then(flushCallbacks);
		}
	} else {
		microTimerFunc = macroTimerFunc;
	}

	export function withMacroTask (fn) {
		return fn._withTask || (fn._withTask = function () {
			useMacroTask = true;
			const res = fn.apply(null, arguments);
			useMacroTask = false;
			return res;
		});
	}

	export function nextTick(cb, ctx) {
		let _resolve;
		callbacks.push(() => {
			if (cb) {
				cb.call(ctx);
			} else if (_resolve) {
				_resolve(ctx);
			}
		});
		if (!pending) {
			pending = true;
			if (useMacroTask) {
				macroTimerFunc();
			} else {
				microTimerFunc();
			}
		}
		if (!cb && typeof Promise !== 'undefined') {
			return new Promise(resolve => {
				_resolve = resolver;
			});
		}
	}

	
	<生命周期>
		/**
		 * @define: 初始化阶段
		 * @description: new Vue() 到created之间的阶段叫作初始化阶段；
		 * 		这个阶段的主要目的是在Vue.js实例上初始化一些属性、事件以及响应式数据，
		 * 		如props、methods、data、watch、provide和inject等。
		 */
		
		/**
		 * @define: 模板编译阶段
		 * @description: 在created钩子函数与beforeMount钩子函数之间的阶段是模板编译阶段。
		 * 		这个阶段的主要目的是将模板编译为渲染函数，只存在于完整版之中。
		 * 		如果在只包含运行时的构建版本中new Vue(),则不会存在这个阶段。
		 */
		
		/**
		 * @define: 挂载阶段
		 * @description： beforeMount钩子函数到到mounted钩子函数之间的是挂载阶段。
		 * 		在这个阶段，Vue会将其实例挂载到Dom元素上，通俗的讲，就是将模板渲染到指定的Dom元素中。
		 * 		在挂载的过程中，Vue会开启Watcher来持续追踪依赖的变化。
		 * 		
		 * 		在已挂载状态下，Vue仍会持续追踪状态变化。当数据(状态)发生变化时，
		 * 		Watcher会通知虚拟DOM重新渲染视图，并且在渲染视图前触发beforeUpdate钩子函数，
		 * 		渲染完成后触发updated钩子函数。
		 *
		 * 		通常，在运行时的大部分时间下，Vue处于已挂载的状态，每当状态发生变化时，Vue都会通知组件
		 * 		使用虚拟DOM重新渲染，也就是我们常说的响应式。这个状态会持续到组件被销毁。
		 */
		
		/**
		 * @define: 卸载阶段
		 * @description: 应用调用vm.$detroy方法后，Vue的生命周期会进入卸载阶段。
		 * 		在这个阶段，Vue会将自身从父组件中删除，取消实例上所有依赖的追踪
		 * 		并且移除所有的事件监听器。 
		 */

		Vue.prototype._init = function(options) {
		 	vm.$options = mergeOptions(
		 		resolveConstrctorOptions(vm.constructor),
		 		options||{},
		 		vm
		 	)

		 	initLifeCycle(vm);
		 	initEvent(vm);
		 	initRender(vm, 'beforeCreate');
		 	initInjections(vm); // 在data/props前初始化inject
		 	initState(vm);
		 	initProvide(vm); // 在data/props后初始化provide
		 	callHook(vm, 'created');

		 	// 如果用户在实例化Vue时传递了el选项，则自动开启模板编译阶段与挂载阶段
		 	// 如果没有传递el选项，则不进入下一个生命周期
		 	// 用户需要执行vm.$mount方法，手动开启模板编译阶段与挂载阶段
		 	if (vm.$options.el) {
		 		vm.$mount(vm.$option.el);
		 	} 
		} 

		export function callHook(vm, hook) {
			const handlers = vm.$options[hook];
			if (handlers) {
				for (let i = 0, j = handlers.length; i < j; i++) {
					handlers[i].call(vm);
				}
			}
		}

		<初始化实例>
		/**
		 * vue通过 initLifecycle函数向实例中挂载属性，该函数接收vue实例作为参数。
		 */
		export function initLifecycle(vm) {
			const options = vm.$options;

			// 找出第一个非抽象父类
			let parent = options.parent;
			if (parent && !options.abstract) {
				while (parent.$options.abstract && parent.$parent) {
					parent = parent.$parent;
				}
				parent.$children.push(vm);
			}

			vm.$parent = parent;
			vm.$root = parent ? parent.$root : vm;

			vm.$children = vm;
			vm.$refs = [];

			vm.$children = null;
			vm._isDestoryed= false;
			vm._isBeingDetoryed = false;
		}