=> vue生命周期
	beforeCreate: 在实例初始化之后，数据观测(data observer)和event/watch事件配置之前被调用。

	created: 在实例创建完成后立即被调用。在这一步，实例已完成以下的配置：数据观测(data observer)，属性和方法的运算，watch/event事件回调。然而，挂载阶段还没有开始，$el属性目前不可见。
	
	beforeMount: 在挂载开始之前被调用：相关的render函数首次被调用。该钩子在服务器端渲染期间不被调用。

	mounted: el被新创建的vm.$el替换，并挂载到实例上去之后调用该多钩子。如果root实例挂载一个文档内元素，当mounted被调用时vm.$el也在文档内。
	注意mounted不会承诺所有的子组件也都一起被挂载。如果你希望等到整个视图都渲染完毕，可以用vm.$nextTick替换掉mounted:
		<script>
			mounted() {
				this.$nextTick(...)
			}
		</script>
	该钩子在服务器端渲染期间被调用。	

	beforeUpdate: 数据更新时调用，发生在虚拟DOM打补丁之前。这里适合在更新之前访问现在的DOM，比如手动移除已添加的事件监听器。
	该钩子在服务器端渲染期间不被调用，因为只有初次渲染会在服务端时进行。

	updated: 由于数据更改导致的虚拟DOM重新渲染和打补丁，在这之后会调用该钩子。
	
	当这个钩子被调用时，组件DOM已经更新，所以你现在可以执行依赖于DOM的操作。然而在大多数情况下，你应该避免在此期间更改状态。如果要相应状态改变，通常最好使用计算属性或watcher取而代之。

	注意update不会承诺所有的子组件也都一起被重绘。如果你希望等到整个视图都重绘完毕你希望等到整个视图都重绘完毕，可以用vm.$nextTick替换掉update。
		<script>
			this.$nextTick(...)
		</script>
	该钩子在服务器端渲染期间不会被调用。

	beforeDestroy: 实例销毁之前调用。在这一步，实例仍然完全可用。该钩子在服务器端渲染期间不被调用。

	destroyed: Vue实例销毁后调用。调用后，Vue 实例指示的所有东西都会解绑定，所有的事件监听器会被移除，所有的子实例也会被销毁。该钩子在服务器端渲染期间不被调用。

=> 模板语法 
	#文本
	数据绑定最常见的形式就是使用“Mustache”语法（双左括号）的文本插值
	<span>Message: {{msg}}</span>

	通过使用v-once指令，你也能执行一次性地插值，当数据改变时，插值处的内容不会更新。但请留心这会影响到谨言该节点上所有数据绑定
	<span v-once>这个不会改变：{{msg}}</span>	

	#原始HTML
	双大括号会将数据解释为普通文本，而非Html代码。为了输出真正的Html，你需要使用v-html指令
	<div v-html="rawHtml"></div>

	#特征
	Mustache语法不能作用在Html特性上，遇到这种情况应该使用v-bind指令
	<div v-bind:id="isButtonDisabled"></div>

	#v-bind 缩写
	<!-- 完整语法 -->
	<a v-bind:href="url"></a>
	<!-- 缩写 -->
	<a :href="url"></a>

	v-on 缩写
	<!-- 完整语法 -->
	<a v-on:click="doSomething"></a>
	<!-- 缩写 -->
	<a @click="doSomething"></a>

	$$计算属性的缓存vs方法

	计算属性是基于它们的依赖进行缓存的。计算属性只有在它的相关依赖发生改变时才会重新求值。

	下面的计算属性将不再更新，因为Date.now()不是响应式依赖：
	computed: {
		now: function() {
			return new Date.now();
		}
	}

	计算属性vs被观察的属性
	Vue确实提供了一种更通用的方式来观察和响应Vue实例上的数据变动：watch属性。当你有一些数据需要随其它数据变动而变动时，
	你很容易滥用watch--特别是如果你之前使用过angularjs.然而，通常更好的想法是使用计算属性而不是命令式的watch回调。

	<div id="demo">{{fullName}}</div>

	<script>
		let vm = new Vue({
			el: '#demo',
			data() {
				return {
					firstName: 'Foo',
					lastName: 'Bar',
					fullName: 'Foo Bar'
				}
			},
			watch: {
				firstName(val) {
					this.fullName = val + ' ' + this.lastName;
				},
				lastName(val) {
					this.fullName = this.firstName + " " + val;
				}
			}
		})
	</script>

	上面代码是命令式的和重复的。将它与计算属性的版本进行比较
	<script>
		let vm = new Vue({
			el: '#demo',
			data() {
				return {
					firstName: 'Foo',
					lastName: 'Bar'
				}
			},
			computed: {
				fillName() {
					return this.firstName + ' ' + this.lastName;
				}
			}
		});
	</script>

	#计算属性的setter
	计算属性默认中有getter, 不过在需要时你也可以提供一个setter :

	<script>
		//...
		computed: {
			fullName: {
				get() {
					return this.firstName + ' ' + this.lastName;
				},
				set(newValue) {
					let names = newValue.split(' ');
					this.firstName = names[0];
					this.lastName = names[1];
				}
			}
		}
	</script>

=>Class与Style绑定
	
	$$ 绑定HTML Class

  #对象语法
  我们可以传给v-bind:class 一个对象，以动态的切换class:
  <div v-bind:class="{active: isActive}"></div>
	上面的语法表示active这个class存在与否取决于数据isActive是否为truthy

	我们也可以在这里绑定一个返回对象的计算属性。这是一个常用且强大的模式
	<div v-bind:class="classObject"></div>

	<script>
		data: {
			isActive: true,
			error: false
		},
		computed: {
			classObject() {
				return {
					'active': this.isActive && !this.error,
					'text-danger': this.error && this.error.type === 'fatal'
				}
			}
		}
	</script>

	#数据语法
	我们可以把一个数组传给v-bind:class，以应用一个class列表；
	<div bind:class="[activeClass, errorClass]"></div>

	data: {
		activeClass: 'active',
		errorClass: 'text-danger'
	}

	渲染为： 
	<div class="active text-danger"></div>


	如果你也想根据条件切换列表中的class，可以用三元表达式
	<div v-bind:class="[{active: isAcitve, errorClass}]"></div>

	#用在组件上
	当一个自定义组件上使用class属性时，这些类被添加到根元素上面。这个元素上已经存在的类不会被覆盖。
	例如，如果你申明了这样一个组件
	<script>
		Vue.component("my-component", {
			template: '<p class="foo bar">Hi</p>'
		})
	</script>

	然后在使用它的时候添加一些class: 
	<my-component class='baz boo'></my-component>

	HTML将被渲染为：
	<p class="foo bar baz boo"></p>

	$$ 绑定内联样式

	#对像语法
	v-bind:style对象语法十分直观--看着非常像CSS，但其实是一个JavaScript对象。CSS属性名可用驼峰式或短横线分隔来命名：
	<div v-bind:style="{color: activeColor, fontSize: fontSize+'px'}"></div>
	
	data: {
		activeColor: 'red'
		fontSize: 30
	}	

	直接绑定到一个样式对象通常更好，这会让模板更清晰：
	<div v-bind:style="styleObject"></div>
	data: {
	  styleObject: {
	    color: 'red',
	    fontSize: '13px'
	  }
	}
	同样的，对象语法常常结合返回对象的计算属性使用。
	
	$$变异方法
	Vue包含一组观察数组的变异方法，所以它们也将会触发视图更新
	push(), pop(), shift(), unshift(), splice(), sort(), reverse();

	$$ 对象更改检测注意事项
	你可以添加一个新的 age 属性到嵌套的 userProfile 对象：
	Vue.set(vm.userProfile, 'age', 27)
	你还可以使用 vm.$set 实例方法，它只是全局 Vue.set 的别名：
	this.$set(this.userProfile, 'age', 27)

	$$一个组件的v-for
	在自定义组件里，你可以像任何普通元素一样用v-for
	<my-component v-for="item in items" :key="item.id"></my-component>
	【注】当在组件中使用v-for时，key是必须要有的
	然而，任何数据都不会被自动传递到组件里，因为组件有自己独立的作用域。为了把迭代数据传递到组件，我们要用props:
	<my-component v-for="(item, index) in items"
								v-bind:item="item"
								v-bind:index="index"
								v-bind:key="item.id"20
	></my-component>

=>事件处理

	$$事件修饰符
	<!-- 阻止单击事件冒泡 -->
	<a v-on:click.stop="doThis"></a>
	<!-- 提交事件不再重载页面 -->
	<form v-on:submit.prevent="onSubmit"></form>
	<!-- 修饰符可以串联 -->
	<a v-on:click.stop.prevent="doThat"></a>
	<!-- 只有修饰符 -->
	<form v-on:submit.prevent></form>
	<!-- 添加事件侦听器时使用事件捕获模式 -->
	<div v-on:click.capture="doThis">...</div>
	<!-- 只当事件在该元素本身 (比如不是子元素) 触发时触发回调 -->
	<div v-on:click.self="doThat">...</div>
	<!-- 点击事件将只会触发一次 -->
	<a v-on:click.once="doThis"></a>

	$$键值修饰符
	<!-- 只有在 keyCode 是 13 时调用 vm.submit() -->
	<input v-on:keyup.13="submit">

	记住所有的 keyCode 比较困难，所以 Vue 为最常用的按键提供了别名：
	<!-- 同上 -->
	<input v-on:keyup.enter="submit">
	<!-- 缩写语法 -->
	<input @keyup.enter="submit">

	按键别名：
	.enter, .tab, .delete(捕获“删除”和“退格”键), .esc, .space, .up, .down, .left, .right;

	可以通过全局 config.keyCodes 对象自定义键值修饰符别名：
	// 可以使用 v-on:keyup.f1
	Vue.config.keyCodes.f1 = 112;

	$$修饰键
	
	可以用如下修饰符来开启鼠标或则键盘事件监听，使在按键按下时发生响应。
	.ctrl, .alt, .shift, .meta
	<!-- Alt + C -->
	<input @keyup.alt.67="clear">
	<!-- Ctrl + Click -->
	<div @click.ctrl="doSomething">Do something</div>

	【说明】修饰键比正常的按键不同；修饰键与keyup事件一起用时，事件引发时必须按下正常的按键。换一种说法：
					如果要引发keyup.ctrl,必须按下ctrl时释放其它按键；单单释放ctrl不会引发事件。
	
	$$鼠标按钮修饰符
	.left, .right, middle
	这些修饰符会限制处理程序监听特定的滑鼠按键。

	<div id="example-5">
  <select v-model="selected">
    <option disabled value="">请选择</option>
    <option>A</option>
    <option>B</option>
    <option>C</option>
  </select>
  <span>Selected: {{ selected }}</span>
	</div>

	【注】如果 v-model 表达初始的值不匹配任何的选项，<select> 元素就会以”未选中”的状态渲染。在 iOS 中，这会使用户无法选择第一个选项，因为这样的情况下，iOS 不会引发 change 事件。因此，像以上提供 disabled 选项是建议的做法。

	#复选框

	<input type="checkbox"
	 			 v-model="toggle"
	  		 v-bind:true-value="a"
	  		 v-bind:false-value="b"
	>
	// 当选中时
	vm.toggle === vm.a
	// 当没有选中时
	vm.toggle === vm.b
	单选按钮

	修饰符
	.lazy
	在默认情况下，v-model在input事件中同步输入框的值与数据，但你可以添加一个修饰符lazy,从而转换成change事件中同步。
	<!-- 在'change'而不是'input'事件中更新 -->
	<input v-model.lazy='msg'>

	.number
	如果想自动将用户输入值转成Number类型（如果原值的转换结果为NaN则返回原值），可以添加一个修饰符number给v-model来处理输入的值。
	<input type="text" v-model.number='age' type='number'>

	.trim
	如果要自动过滤掉用户输入的首尾空格，可以添加trim修饰符到v-model上过滤输入。
	<input type="text" v-model.trim='msg'>

	#Prop验证
	我们可以为组件的Prop指定验证规则。如果传入的数据不符合要求，Vue会发出警告。这对于开发给他人使用的组件非常有用。
	要指定验证规则，需要用对象的形式来定义，而不能用字符串的形式来定义。


	<script>
		Vue.component('example', {
		  props: {
		    // 基础类型检测 (`null` 指允许任何类型)
		    propA: Number,
		    // 可能是多种类型
		    propB: [String, Number],
		    // 必传且是字符串
		    propC: {
		      type: String,
		      required: true
		    },
		    // 数值且有默认值
		    propD: {
		      type: Number,
		      default: 100
		    },
		    // 数组/对象的默认值应当由一个工厂函数返回
		    propE: {
		      type: Object,
		      default: function () {
		        return { message: 'hello' }
		      }
		    },
		    // 自定义验证函数
		    propF: {
		      validator: function (value) {
		        return value > 10
		      }
		    }
		  }
		})
	</script>

=>自定义事件

	#使用v-on绑自定义事件
	每个Vue实例都实现了事件接口，即
	> 使用$on(eventName)监听事件。
	> 使用$emit(eventName)触发事件。

	#给组件绑定原生事件
	有时候，你可能想在某个组件元素上监听一个原生事件。可以使用v-on的修饰符 .native 。例如
	<my-component v-on:click.native='doTheThing'></my-component>

=>使用插槽分发内容

	#单个插槽
	
	除非子组件模板包含至少一个<slot>插口，否则父组件的内容将会被丢弃。当子组件模板只有一个没的属性的插槽时，父组件传入的整个内容片段
	将插入到插槽所在的DOM位置，并替换插槽标签本身。

	最初在<slot>标签中的任何内容都被视为备用内容。备用内容在子组件的作用域内编译，并且只有在宿主元素为空，且没有要插入的内容时才显示
	备用内容。

	假定 my-component 组件有如下模板：

	<div>
		<h2>我是子组件标题</h2>
		<slot>
			只有没有要分发内容时都会显示。
		</slot>
	</div>

	父组件模板：

	<div>
		<h1>我的父组件的标题</h1>
		<my-component>
			<p>这是一些初始内容</p>
			<p>这是更多的初始内容</p>
		</my-component>
	</div>
	
	渲染结果：
	<div>
		<h1>我是父组件的标题</h1>
		<div>
			<h2>我是子组件的标题</h2>
			<p>这是一些初始内容</p>
			<p>这是更多的初始内容</p>
		</div>
	</div>

	#具名插槽
	
	<slot>元素可用一个特殊的特性 name 来进一步配置如何分发内容。多个插槽可以有不同的名字。具名插槽将匹配内容片段中有对应 slot 特性的元素。

	仍然可以有匿名插槽，它是默认插槽，作为找不到匹配的内容片段的备用插槽。如果没有默认插槽，这些找不到匹配内容片段将被抛弃。

	例如，假定我们有一个app-layout组件，它的模板为：

	<div class="container">
		<header>
			<slot name='header'><slot>
		</header>
		<main>
			<slot></slot>
		</main>
		<footer>
			<slot name='footer'></slot>
		</footer>
	</div>

	父组件模板

	<app-layout>
		<h1 slot='header'>这里可能是一个页面标题</h1>

		<p>主要内容的一个段落</p>
		<p>另一个主要内容</p>

		<p slot='footer'>这里有一些联系信息</p>
	</app-layout>

	渲染结果为：
	<div class="container">
		<header>
			<h1>这里可能是一个页面标题</h1>
		</header>
		<main>
			<p>主要内容的一个段落</p>
			<p>另一个主要内容</p>
		</main>
		<footer>
			<p>这里有一些联系信息</p>
		</footer>
	</div>

	#作用域插槽

	作用域插槽是一种特殊类型的插槽，用作一个（能被传递数据的）可重用的模板，来代替已经渲染好的元素。

	在子组件中，只需将数据传递到插槽，就像你将prop传递给组件一样：
	<div class="child">
		<slot text='hello from child'></slot>
	</div>

	在父级中，具有特殊特性slot-scope的<template>元素必须存在，表示它是作用域插槽的模板。slot-scope的值将被用作一个临时变量名，此变量接收从子组件传递过来的prop对象：

	<div class="parent">
		<child>
			<template slot-scope="props">
				<span>hello from parent</span>
				<span>{{ props.text }}</span>
			</template>
		</child>
	</div>

	如果我们渲染上述模板，得到的输出会是：

	<div class="parent">
		<div class="child">
			<span>hello from parent</span>
			<span>hello from child</span>
		</div>
	</div>

	【注】在2.5.0+，slot-scope能被用在任意元素或组件中而不再局限于<template>。

	作用域插槽更典型的用例是列表组件中，允许使用者自定义如何渲染列表的每一项:

	<my-aweasome-list :items='items'>
		<!-- 作用域插槽也可以是具名的 -->
		<li slot='item'
				slot-scope='props'
				class="my-fancy-item" 
		>
			{{ props.text }}
		</li>
	</my-aweasome-list>

	列表组件的模板
	<ul>
		<slot name='item'
					v-for='item in items'
					:text='item.text'
		>
			<!--这里写入备用的内容-->
		</slot>
	</ul>

=>动态组件
	通过使用保留的<component>元素，动态的绑定到它的is特性，我们让多个组件可以使用同一个挂载点，并动态的切换：

	<script>
		let vm = new Vue({
			el: '#example',
			data: {
				currentView: 'home'
			},
			components: {
				home: {}
				post: {}
				archive: {}
			}
		})
	</script>

	<component v-bind:is='currentView'></component>

=>杂项
	
	#编写可复用的组件
	在编写组件时，最好考虑好以后是否要进行复用。一次性组件间有紧密的耦合没关系，但是可复用的组件应当定义一个清晰的公开接口，同时也不要对其使用的外层数据作出任何假设：

	Vue组件中的Api来自三个部分--prop，事件和插槽：
	prop允许外部环境传递数据给组件；
	事件允许从组件内部触发外部环境的副作用；
	插槽允许外部环境将额外的内容组合在组件中；

	使用v-bind和v-on的简写语法，模板的意图会更清楚且简洁：

	<my-component :foo='baz'
								:bar='qux'
								@event-a='doThis'
								@envet-b='doThat'
	>
		<img slot='icon' src="...">
		<p slot='main-text'>Hello</p>	
	</my-component>	

	#子组件引用
	尽管有props和事件，但是有时仍然需要在javascript中直接访问子组件。为此可以使用ref为子组件指定一个引用ID。

	<div id='parent'>
		<user-profix ref='profix'></user-profix>
	</div>

	<script>
		let parent = new Vue({el: '#parent'});

		let child = parent.$refs.profix
	</script>

	当ref和v-for一起使用时，获取到的引用会是一个数组，包含和循环数据源对应的子组件。
	【注】只有在组件渲染完成后才填充，并且它是非响应式的。它仅仅是一个直接操作子组件的应急方案--应当避免在模板或计算属性中使用$refs。

	#异步组件

	在大型的应用中，我们可能需要将模块拆分成多个小模块，按需从服务器下载。为了进一步简化，Vue.js允许将组件定义为一个工厂函数，异步的解析组件的定义。Vue.js只在组件需要渲染时触发工厂函数，并且把结果缓存起来，用于后面的再次渲染。

	<script>
		Vue.component('async-example', (resolve, reject) => {
			setTimeout(() => {
				resolve({
					template: '<div>I an async</div>'
				});
			}, 1000)
		});
	</script>

	工厂函数接收一个resolve回调，在收到从服务器下载的组件定义时调用。也可以调用reject(reason)指示加载失败。这里的setTimeout只是为了演示，实际上如何工获取完全由你决定。推荐配合webpack的代码分割来使用：
	<script>
		Vue.component('async-webpack-example', (resolve) => {

		});
	</script>

	你可以在工厂函数中返回一个Promise，所以当使用webpack2+ES2015的语法时可以这样：
	<script>
		new Vue({
			// 该 `import` 函数返回一个 `Promise` 对象。
			components: {
				'my-component': () => import('./my-async-component');
			}
		})
	</script>

=> 过渡与动画
	
	>> 单元素/组件的过渡

	Vue提供了transition的封装组件，在下列情形中，可以给任何元素和组件添加entering/leaving过渡
	1.条件渲染(使用v-if)
	2.条件展示(使用v-show)
	3.动态组件
	4.组件节点

	这里是一个典型子：

	<div id="demo">
		<button @click='show = !show'>
			Toggle
		</button>
		<transition name="fade">
			<p v-if='show'>hello</p>
		</transition>
	</div>

	<script>
		new Vue({
			el: '#demo',
			data: {
				show: false
			}
		})
	</script>

	<style>
		.fade-enter-active, .fade-leave-active {
			transition: opacity .5s;
		}
		.fade-enter, .fade-leave-to {
			opacity: 0;
		}
	</style>

	当插入或删除包含在transition组件中的元素时，Vue将会做以下处理：
	1.自动嗅探目标元素是否应用了CSS过渡或动画，如果是，在恰当的时机添加/删除CSS类名。
	2.如果过渡组件提供了JavaScript钩子函数，这些钩子函数将在恰当的时机被调用。
	3.如果没有找到JavaScript钩子并且也没有检测到CSS过渡/动画，DOM操作（插入/删除）在下一帧中立即执行。（注意：此指浏览器逐帧动画机制，和Vue的nextTick概念不同）

	#过渡的类名
	在进入/离开的过渡中，会有6个class切换。
	1. v-enter: 定义进入过渡的开始状态。在元素被插入时生效，在下一个帧移除。
	2. v-enter-active: 定义过渡的状态。在元素整个过程中作用，在元素被插入时生效，在transition/animation 完成之后移除。这个类可以被用来定义过渡的过程时间，延误和曲线函数。
	3. v-enter-to: 2.1.8版及以上 定义进入过渡的结束状态。在元素被插入一帧后生效（于此同时v-enter被删除），在transition/animation完成之后移除。
	4. v-leave: 定义离开过渡的开始状态。在离开过渡被触发时生效，在下一个帧移除。
	5. v-leave-active: 定义过渡的状态。在元素整个过渡过程中作用，在离开过渡被触发后立即生效，在transition/animation完成之后移除。这个类可以被用来定义过渡的过程时间，延迟和曲线函数。
	6. v-leave-to:  2.1.8版及以上 定义离开过渡的结束状态。在离开过渡被触发一帧后生效 (于此同时 v-leave 被删除)，在 transition/animation 完成之后移除。

	对于这些在 enter/leave 过渡中切换的类名，v- 是这些类名的前缀。使用<transition name="my-transition"> 可以重置前缀，比如 v-enter 替换为 my-transition-enter。


	#css动画 
	css动画用法同css过渡，区别是在直动画中v-enter类名在节点插入DOM后不会立即删除，而在animationend事件触发时删除。

	<div class="example-2">
		<button @click="show = !show">toggle show</button>
		<transition name='bounce'>
			<p v-if='show'>Look at me</p>
		</transition>
	</div>

	<script>
		new Vue({
			el: '#example-2',
			data: {
				show: true
			}
		})
	</script>

	<style lang='less' scope>
		.bounce-enter-active {
			animation: bounce-in .5s;
		}
		.bounce-leave-active {
			animation: bounce-in .5s reverse;
		}
		@keyframes bounce-in {
			0% {
				transition: scale(0);
			}
			50% {
				transition: scale(1.5);
			}
			100% {
				transition: scale(1);
			}
		}
	</style>

=> 可复用与组合

	>> 混合
		混合是一种分发Vue组件中可复用功能的非常灵活的方式。混合对象可以包含任意组件选项。以组件使用混合对象时，所有混合对象的选项将被混入该组件本身的选项。

		<script>
			//定义一个混合对象
			let myMixin = {
				created: function() {
					this.hello();
				},
				methods: {
					hello: function() {
						console.log('hello from mixin')
					} 
				}
			}

			//定义一个使用混合对象的组件
			let Component = Vue.extend({
				mixins: [myMixin]
			});

			let component = new Component();

		</script>

		#选项合并
		当组件和混合对象含有同名的选项时，这些选项将以恰当的方式混合。比如，同名钩子函数将混合为一个数组，因此都将被调用。另外，混合对象的钩子将在组件自身钩子之前调用。
		<script>
			let mixin = {
				created: function() {
					console.log("混合对象的钩子被调用");
				}
			}

			new Vue({
				mixins: [mixin],
				created: function() {
					console.log('组件钩子被调用');
				}
			});

			// => "混合对象的钩子被调用"
			// => "组件钩子被调用"
		</script>

		值为对象的选项，例如 methods, components 和 directives , 将被混合为同一个对象。两个对象键名冲突时，取组件对象的键值对。
		<script>
			let mixin = {
				methods: {
					foo: function() {
						console.log('foo');
					},
					conflicting: function() {
						console.log('from mixin');
					}
				}
			}

			let vm = new Vue({
				mixins: [mixin],
				methods: {
					bar: function() {
						console.log('bar');
					},
					conflicting: function() {
						console.log('from self');
					}
				}
			});

			vm.foo(); // => 'foo'
			vm.bar(); // => 'bar'
			vm.conflicting(); // => 'from self'
		</script>

		[注] Vue.extend() 也使用同样的策略进行合并。

		#全局混合
		也可以全局注册混合对象。注意使用！一但使用全局混合对象，将会影响所有之后创建的Vue实例。使用恰当时，可以为自定义的对象注入处理逻辑
		<script>
			// 为自定义的选项'myOption'注入一个处理器。
			Vue.mixin({
				created: function() {
					let myOption = this.$options.myOption;
					if(myOption) {
						console.log(myOption);
					}
				} 
			});

			new Vue({
				myOption: "hello"
			});
		</script>
	
	>> 自定义指令

		<script>
			// 注册一个全局自定义指令 v-focus
			Vue.directive('focus', {
			  // 当绑定元素插入到 DOM 中。
			  inserted: function (el) {
			    // 聚焦元素
			    el.focus()
			  }
			})
		</script>
		
		<script>
			// 也可以注册局部指令，组件中接受一个 directives 的选项：
			new Vue.component({
				el: 'example',
				data: function() {

				},
				directives: {
				  focus: {
				    // 指令的定义
				    inserted: function (el) {
				      el.focus()
				    }
				  }
				}
			});
		</script>	


		1.钩子函数
		指令定义函数提供了几个钩子函数
		bind: 只调用一次，指令第一次绑定到元素时调用，用这个钩子函数可以定义一个在绑定时执行一次的初始化操作。
		inserted: 被绑定元素插入父节点时调用（父节点存在即可调用，不必存在于document中）。
		update: 所在组件的VNode更新时调用，但是可能发生其孩子的VNode更新之前。指令的值可能发生了改变也可能没有。但是你可能通过比较更新前后的值来忽略不必要的模板更新。
		componentUpdated: 所有组件VNode及其孩子VNode全部更新时调用。
		unbind: 只调用一次，指令与元素解绑时调用。

		2.钩子函数参数
		钩子函数被赋于以下参数
		el: 指令所绑定的元素，可以用来直接操作DOM。
		binding：一个对象，包含以下属性：
			·name: 指令名，不包括 v- 前缀。
			·value: 指令的绑定值，例如：v-my-directive="1 + 1"，value的值是2。
			·oldValue: 指令绑定前的一个值，仅在 update 和 componentUpdate 钩子中可用。无论值是否改变都可用。
			·expression: 绑定值的字符串形式。例如 v-my-directive="1 + 1"，expression的值是"1 + 1"。
			·arg: 传递给指令的参数。例如：v-my-directive:foo，arg的值是"foo"。
			·modifiers: 一个包含修饰符的对象。例如：v-my-directive.foo.bar，修饰符对象modifiers的值是{foo: true, bar: true}。
	  vnode: Vue编译生成的虚拟节点。
	  oldVnode: 上一个虚拟节点，仅在update和componentUpdated钩子中可用。

	  #函数简写
	  大多数情况下，我们可能想在bind和update钩子上做重复动作，并且不想关心其它的钩子函数。可以这样写：
	  <script>
	  	Vue.directive('color-switch', function(el, binding) {
	  		el.style.backgroundColor = binding.value;
	  	});
	  </script>

	  #对象字面量
	  如果指令需要多个值，可以传入一个JavaScript对象字面量。记住，指令函数能够接受所有合法类型的JavaScript表达式。

	  <div v-demo="{color: 'white', value: 'hello'}"></div>

	  <script>
	  	Vue.directive('demo', function(el, binding) {
	  		console.log(binding.value.color);
	  		console.log(binding.value.value);
	  	})
	  </script>

	>> 渲染函数 与 jsx
		Vue推荐在绝大多数情况下使用template来创建你的HTML。然而在一些场景中，你真的需要JavaScript的完全编程的能力，这就是render函数，它比template更接近编译器。

		<h1>
			<a name="hello-world" href="#hello-world">
				Hello World!!
			</a>
		</h1>

		在HTML层，我们决定这样定义组件接口：

		<anchored-heading :level='1'>Hello World!</anchored-heading>

		当我们开始写一个通过level prop动态生成heading标签的组件，你可能很快想到这样实现：
		<template>
			<h1 v-if="level === 1">
		    <slot></slot>
		  </h1>
		  <h2 v-else-if="level === 2">
		    <slot></slot>
		  </h2>
		  <h3 v-else-if="level === 3">
		    <slot></slot>
		  </h3>
		  <h4 v-else-if="level === 4">
		    <slot></slot>
		  </h4>
		  <h5 v-else-if="level === 5">
		    <slot></slot>
		  </h5>
		  <h6 v-else-if="level === 6">
		    <slot></slot>
		  </h6>
		</template>

		<script>
			Vue.component('anchored-heading', {
				props: {
					level: {
						type: Number,
						require: true
					}
				}
			})
		</script>

		在这种场景中的使用template并不是一个最好的选择：首先代码冗长，为了在不同级别的标题中插入锚点元素，我们需要重复的使用<slot></slot>

		虽然模板在大多数组件中都非常好用，但是在这里它就不是很简洁了。那么，我们来尝试使用render函数重写上面的例子。

		<script>
			Vue.component('anchored-heading', {
				render(createElement) {
					return createElement(
						'h'+this.level,   // tag name 标签名称
						this.$slots.default  // 子组件中的陈列
					)
				},
				props: {
					level: {
						type: Number,
						required: true
					}
				}
			});
		</script>

		#createElement参数
		<script>
			// @returns {VNode}
			createElement(
				// {Sting | Object | Function}
				// 一个HTML标签字符串，组件选项对象，或者一个返回值类型为String的函数，必要参数
				'div'

				// {Object}
				// 一个包含模板相关属性的数据对象
				// 这样，您可以在template中使用这些属性，可选参数
				{
					// ...
				},
				[
					'先写一些文字',
					createElement('h1', '一则头条'),
					createElement(MyComponent, {
						props: {
							someProps: 'fooBar'
						}
					})
				]
			);
		</script>

		#深入data对象

		<script>
			// @returns {VNode}
			{
			  // 和`v-bind:class`一样的 API
			  class: {
			    foo: true,
			    bar: false
			  },
			  // 和`v-bind:style`一样的 API
			  style: {
			    color: 'red',
			    fontSize: '14px'
			  },
			  // 正常的 HTML 特性
			  attrs: {
			    id: 'foo'
			  },
			  // 组件 props
			  props: {
			    myProp: 'bar'
			  },
			  // DOM 属性
			  domProps: {
			    innerHTML: 'baz'
			  },
			  // 事件监听器基于 `on`
			  // 所以不再支持如 `v-on:keyup.enter` 修饰器
			  // 需要手动匹配 keyCode。
			  on: {
			    click: this.clickHandler
			  },
			  // 仅对于组件，用于监听原生事件，而不是组件内部使用 `vm.$emit` 触发的事件。
			  nativeOn: {
			    click: this.nativeClickHandler
			  },
			  // 自定义指令。注意事项：不能对绑定的旧值设值
			  // Vue 会为您持续追踪
			  directives: [
			    {
			      name: 'my-custom-directive',
			      value: '2',
			      expression: '1 + 1',
			      arg: 'foo',
			      modifiers: {
			        bar: true
			      }
			    }
			  ],
			  // Scoped slots in the form of
			  // { name: props => VNode | Array<VNode> }
			  scopedSlots: {
			    default: props => createElement('span', props.text)
			  },
			  // 如果组件是其他组件的子组件，需为插槽指定名称
			  slot: 'name-of-slot',
			  // 其他特殊顶层属性
			  key: 'myKey',
			  ref: 'myRef'
			}
		</script>

		**完整示例
		<script>
			let getChildrenTextContent = function (children) {
				return children.map(()=>{
					return node.children 
						? getChildrenTextContent(node.children)
						: node.text;
				}).join('');
			}

			Vue.component('anchored-heading', {
				render(createElement) {
					let headingId = getChildrenTextContent(this.$slots.default)
						.toLowerCase()
						.replace(/\W+/g, '-')
						.replace(/(^\-|\-$)/g, '');

					return createElement(
						'h'+this.level,
						[
							createElement('a',{
								attrs: {
									name: headingId,
									href: '#'+headingId
								}
							}, this.$slots.default)
						]
					)	
				},
				props: {
					level: {
						type: Number,
						required: true
					}
				}
			});
		</script>


		#约束
		VNodes必须唯一
		组件树中的的所有VNode必须是唯一的。这意味着，下面的render function是无效的
		<script>
			render: function(createElement) {
				let myParagraphVNode = createElement('p', 'hi');
				return createElement('div', [
					// 错误 重复的VNode
					myParagraphVNode, myParagraphVNode
				])
			}
		</script>

		如果你真的需要重复很多次的元素/组件，你可以使用工厂函数来实现。例如，下面这个例子render函数完美有效的渲染了20个重复段落。
		<script>
			render: function(createElment) {
				Array.apply(null, { length: 20 }).map(() => {
					return createElement('p', 'hi')
				});
			}
		</script>

		>>使用JavaScript代替模板功能

		#v-if 和 v-show
		由于使用原生的JavaScript来实现某些东西很简单，Vue的render函数没有提供会专用的API，比如，template中的v-if和v-for :

		<ul v-if='item.length'>
			<li v-for="item in items">{{ item.name }}</li>
		</ul>
		<p v-else>No items found.</p>

		这些都会在render函数中被JavaScript的 if / else 和 map 重写：
		<script type="text/javascript">
			render: function(createElement) {
				if (this.items.length) {
					return createElement('ul', this.item.map((items) =>{
						return createElement('li', item.name);
					}));
				} else {
					return createElement('p', 'No items found.');
				}
			}
		</script>

		#v-model
		render函数中的没有与v-model相应的API 你必须自己来实现相应的逻辑：
		<script type="text/javascript">
			render: function(createElement) {
				let self = this;
				return createElement('input', {
					domProps: {
						value: self.value
					},
					on: {
						input(event) {
							self.value = event.target.value;
							self.$emit('input', event.target.value);
						}
					}
				})
			}
		</script>

		#插槽
		你可以从this.$slots获取VNodes列表中的静态内容
		<script type="text/javascript">
			render: function(createElement) {
				//<div><slot></slot><div>
				return createElement('div', this.$slots.default)
			} 
		</script>

		还可以从this.$scopedSlots中获得能用作函数的作用域插槽，这个函数返回VNodes：
		<script type="text/javascript">
			render: function(createElement) {
				//<div><slot :text="msg"></slot></div>
				return createElement('div', [
					this.$scopedSlots.default({
						text: this.msg
					})
				]);
			}
		</script>

	>> 插件

		·开发插件

		插件通常会为Vue添加全局功能。插件的范围没有限制——一般有以下的几种：
		1.添加全局方法或属性，如：vue-custom-element
		2.添加全局资源：指令/过滤器/过渡等，如vue-touch
		3.通过全局mixin方法添加一些组件选项，如：vue-router
		4.添加Vue实例方法，通过把它们添加到Vue.prototype上实现。
		5.一个库，提供自己的API，同时提供上面提到的一个或多个功能。如vue-router

		Vue.js的插件应当有一个公开方法install。这个方法的第一个参数是Vue构造器，第二个是一个可选的选项对象：
		<script>
			MyPlugin.install = function(Vue, options) {
				// 1.添加全局方法或属性
				Vue.myGlobalMethod = function() {

				}

				// 2.添加全局资源
				Vue.directive('my-directive', {
					bind(el, binding, vnode, oldVnode) {

					}
				});

				// 3.注入组件
				Vue.mixin({
					created: function() {

					}
				});

				// 4.添加实例方法 
				Vue.prototype.$myMethod = function(methodOptions) {

				}

			}
		</script>

	>> 过滤器
		Vue.js允许你自定义过滤器，可被用作一常见的文本格式化。过滤器可以用在两个地方：
		mustache插值 和 v-bind表达式。过滤器应该被添加在JavaScript表达式的尾部，由“管道”符指示：

		<!-- in mustache -->
		{{ message | capitabize }}

		<!-- in v-bind -->
		<div v-bind:id='rawId | formatId'></div>

		你可以在一个组件的选项中定义本地的过滤器
		<script>
			filter: {
				capitalize: function(value) {
					if(!value) return '';
					value = value.toString();
					return value.charAt(0).toUpperCase() + value.slice(1);
				}
			}
		</script>

		或者全局定义过滤器
		<script>
			Vue.filter('capitalize', (value) => {
				if(!value) return;
				value = value.toString();
				return value.charAt(0).toUpperCase()+value.slice();
			});
		</script>
		
		过滤器可以串联：
		{{message | filterA | filterB}}

		过滤器是JavaScript函数，因此可以接收参数：
		{{message | filterA('arg1', 'arg2')}}


	<script>
		import MsiUsers from './src/MsiUsers';

		/* istanbul ignore next */
		MsiUsers.install = function(Vue) {
		  Vue.component(MsiUsers.name, MsiUsers);
		};

		export default MsiUsers;
	</script>