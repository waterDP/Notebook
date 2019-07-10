每一个Vuex应用的核心就是store(仓库)。'store'基本上就是一个容器，它包含着的应用中大部分状态（state）。Vuex和单纯的全局对象有以下两点不同。
	1.Vuex的状态存储是响应式的。当Vue组件从store中读取状态的时候，若store中的状态发生变化，那么相应的组件也会相应地得到高效更新。
	2.你不能直接改变store中的状态。改变store中的状态的唯一途径就是显示地提交（commit）mutation。这样使得你们可以方便的跟踪每一个状态的变化，从而让我们可以实现一些工具帮助我们更好的了解我们的应用。

=> 最简单的store
	<script>
		const store = new Vuex.Store({
			state: {
				count: 0
			},
			mutations: {
				increament (state) {
					state.count++;
				}
			}
		});
	</script>	
	现在，你可以通过store.state来获取状态对象，以及通过store.commit方法触发状态变更。
	<script>
		store.commit('increment');

		console.log(store.state.count); // 1
	</script>
	再次强调，我们通过提交mutation的方式，而非直接改变store.state.count，是因为我们想要明确的追踪状态的变化。这个简单的约定能够让你的意图更加明显， 这样的你在阅读代码的时候能更容易解读应用内部的状态变化。此外，这样也让我们有机会去实现一些能够记录每次状态改变，保存状态改变快照的调试工具。有了它，我们甚至可以实现如时间穿梭般的调度体验。

=> 核心概念
	>> State
		单一状态树
		Vuex使用单一状态树--是的，用一个对象就包含了全部的应用层级状态。至此它便成为一个‘唯一数据源’而存在。这也意味着，每个应用将仅仅包含一个store实例。单一状态树让我们能够直接的定位任一特定的状态片段，在调试的过程中，也能轻易的取得整个当前应用状态的快照。

		>>在Vue组件中获得Vuex状态
		由于Vuex的状态是响应式的，从store实例中读取状态最简单的方法就是在计算属性中返回某个状态：
		<script>
			// 创建一个Counter组件
			const Counter = {
				template: `<div>{{count}}</div>`,
				computed: {
					count () {
						return store.state.count;
					}
				}
			}
		</script>

		然而，这种模式导致组件依赖全局状态单例。在模块化的构建系统中，在每个使用store的组件中需要频繁地导入，并且在测试组件时需要模拟状态。
		Vuex通过store选项，提供了一种机制将状态从根组件"注入"到每一个子组件中(需调用Vue.use(Vuex)):
		<script>
			const app = new Vue({
				el: '#app',
				// 把store对象提供给‘store’选项，这可以把store的实例注入所有的子组件
				store，
				components: {Counter},
				template: `
					<div class="app">
						<counter></counter>
					</div>
				` 
			});
		</script>
		通过在根实例中注册store选项，该store实例会注入到根组件下的所有子组件中，且子组件能通过this.$store访问到。让我们更新下Counter的实现：
		<script>
			const Counter = {
				template: `<div>{{count}}</div>`,
				computed: {
					count() {
						return this.$store.state.count;
					}
				}
			}
		</script>

		>> mapState辅助函数
		当一个组件需要获取多个状态的时候，将这些状态都声明为计算属性会有些重复和冗余。为了解决这个问题，我们可以使用mapState辅助函数帮助我们生成计算属性，让你少写代码：
		<script>
			// 在单独构建的版本中辅助函数为Vuex.mapState
			import {mapState} from 'vuex';

			export default {
				// ...
				computed: mapState({
					// 箭头函数可使代码更简练
					count: state => state.count,

					// 传字符串参数'count'等同于 state => state.count
					countAlias: 'count',

					// 为了能够使用'this'获取局部状态，必须使用常规函数
					countPlusLocalState (state) {
						return state.count + this.localCount;
					}
				});
			}
		</script>	

		当映射的计算属性的名称与state的子节点名称相同时，我们也可以给mapState传入一个字符串数组。
		<script>
			computed: mapState ([
				// 映射this.count为store.state.count
				'count'
			]);
		</script>

	>> Getter
		有时候我们需要从store中派生出一些状态，例如对列表时行过滤并计数：
		<script>
			computed: {
				doneTodoCount () {
					return this.$store.state.todos.filter(todo => todo.done).length;
				}
			}
		</script>

		如果有多个组件需要用到这个属性，我们要么复制这个函数，或者抽取到一个共享函数然后在多处导入它--无论哪种方式都不是很理想。
		Vuex允许我们在store中定义'getter'（可以认为是store的计算属性）。就像计算属性一样，getter的返回值会根据它的依赖被缓存起来，且只有当它的依赖发生了改变才会被重新计算。
		Getter接受state作为第一个参数：
		<script>
			const store = new Vuex.store({
				state: {
					todos: [
						{id: 1, text: '...', done: true},
						{id: 2, text: '...', done: false}
					]
				}, 
				getters: {
					doneTodos: state => {
						return state.todos.filter(todo => todo.done)
					}
				}
			});
		</script>

		Getter会暴露为store.getters对象：
			store.getters.doneTodos  // -> [{id: 1, text: '...', done: true}]
		你也可以通过让getter返回一个函数，来实现给getter传参。在你对store里的数组进行查询时非常有用：
		<script>
			getters: {
				// ...
				getTodoById: (state) => (id) => {
					return state.todos.find(todo => todo.id === id);
				}
			}

			store.getters.getTodoById(2) //-> {id: 2, text: '...', done: false}
		</script>

		>> mapGetters辅助函数
		mapGetters辅助函数仅仅是将store中的getter映射到情况的计算属性：
		<script>
			import {mapGetters} from 'vuex';

			export default {
				//...
				computed: {
					// 使用对象展开运算符将getter混入computed对象中
					...mapGetters([
						'doneTodosCount',
						'anotherGetter',
						// ...
					]);
				}
			}
		</script>

		如果你想将一个getter属性另取一个名字，使用对象形式：
		<script>
			mapGetters({
				doneCount: 'doneTodosCount'
			});
		</script>

	>> Mutation
		更改Vuex的store中的状态的唯一方法是提交mutation. Vuex中的mutation非常类似于事件：每个mutation都有一个字符串的事件类型和一个回调函数。这个回调函数就是我们实际进行状态更改的地方，并且它会接受state作为第一个参数。
		<script>
			const store = new Vuex.Store({
				state: {
					count: 1
				},
				mutations: {
					increment (state) {
						// 变更状态
						state.count++;
					}
				}
			});
		</script>

		你不能直接调用一个mutation handler。这个选项更像事件注册："当触发一个类型为increment的mutation时，调用此函数。"要唤醒一个mutation handler，你需要以相应的type调用store.commit方法:
		<script>
			store.commit('increment');
		</script>

		>> 提交载荷（Payload）
		你可以向store.commit传入额外的参数，即mutation的载荷（payload）: 
		<script>
			//...
			mutatios: {
				increment (state, n) {
					state.count += n;
				}
			}

			store.commit('increment', 10);
		</script>

		在多数情况下，载荷应该是一个对象，这样可以包含多个字段并且记录的mutation会更易读：
		<script>
			//...
			mutations: {
				increment (state, payload) {
					state.count += payload.amount;
				}
			}

			store.commit('increment', {
				amount: 10
			});
		</script>

		>>对象风格的提交方式
		提交mutation的另一种方式是直接使用包含type属性的对象：
		<script>
			store.commit({
				type: 'increment',
				amount: 10
			});
		</script>

		当使用对象风格的提交方式，整个对象都作为载荷传给mutation函数，因此handler保持不变：
		<script>
			mutations: {
				increment (stat, payload) {
					state.count += payload.amount;
				}
			}
		</script>

		[mutation需遵守Vue的响应规则]
		既然Vuex的store中的状态是响应式的，那么当我们变更状态时，监视状态的Vue组件也会自动更新。这也意味着Vuex中的mutation也需要与使用Vue一样遵守一些注意事项：
		1.最好提前在store中初始化好所有所需属性。
		2.当需要在对象上添加新属性时，你应该
			·使用Vue.set(obj, 'newProp', 123),或者
			·以新对象替换老对象，例如，利用stage-3有对象展开运算符我们可以这样写：
				state.obj = {...state.obj, newProp: 123}

		>> 使用常量替代Mutation事件类型
		使用常量替代mutation事件类型在各种flux实现中是很常见的模式。这样可以使linter之类的工具发挥作用，同时把这些常量放在单独的文件中可以让你的代码合作者对整个app包含的mutation一目了然：
		<script>
			//mutation-types.js
			export const SOME_MUTATION = 'SOME_MUTATION';

			//store.js
			import Vuex from 'vuex';
			import {SOME_MUTATION} from './mutation-types'

			const store = new Vuex.Store({
				state: {...},
				mutations: {
					// 我们可以使用ES2015风格的计算属性命名功能来使用一个常量作为函数名
					[SOME_MUTATION] (state) {
						// mutate state
					}
				}
			})
		</script>		

	>> Action
		Action类似于mutation, 不同在于：
		·Action提交的是mutation，而不是直接变更状态。
		·Action可以包含任意异步操作。

		让我们来注册一个简单的action:
		<script>
			const store = new Vuex.Store({
				state: {
					count: 0
				},
				mutations: {
					increment (state) {
						state.count++;
					}
				},
				actions: {
					increment (context) {
						context.commit('increment');
					}
				}
			});
		</script>	
		Action函数接受一个与store实例相同方法和属性的context对象，因此你可以调用context.commit提交一个mutation，或者通过context.state和context.getters来获取state和getters。
		实践中，我们会经常用到ES2015的参数来简化代码（特别是我们需要调用commit很多次的时候）：
		<script>
			actions: {
				increment ({commit}) {
					commit('increment');
				}
			}
		</script>

		>> 分发Action
		Action通过store.dispatch方法触发：
		<script>
			store.dispatch('increment')
		</script>
		乍一眼看上去感觉多此一举，我们直接分发mutation岂不更方便？实际上并非如此，还记得mutation必须同步执行这个限制么？Action就不受约束！我们可以在action内部执行异步操作：
		<script>
			actions: {
				incrementAsync({commit}) {
					setTimeout(() => {
						commit('increment');
					}, 1000);
				}
			}
		</script>

		Actions支持同样的载荷方式和对象方式进行分发：
		<script>
			// 以载荷形式分发
			store.dispatch('incrementAsync', {
				amount: 10
			});

			// 以对象形式分发
			store.dispatch({
				type: 'incrementAync',
				amount: 10
			});
		</script>

		来看一个更加实际的购物车示例，涉及到调用异步API和分发多重mutation:
		<script>
			actions: {
				checkout ({commit, state}, products) {
					// 把当前购物车的物品备份起来
					const saveCartItems = [...state.cart.added];
					// 发出结账请求，然后乐观地清空购物车
					commit(types.CHECKOUT_REQUEST);
					// 购物API接受一个成功的回调和一个失败的回调
					shop.buyProducts(
						products,
						// 成功操作
						() => commit(types.CHECKOUT_SUCCESS),
						// 失败操作
						() => commit(types.CHECKOUT_FAILURE, saveCartItems)
					)
				}
			}
		</script>
		注意我们正在进行一系列的异步操作，并且通过提交mutation来记录action产生的副作用（即状态变更）。

		>> 在组件中颁发 Action
		你在组件中使用this.$store.dispatch('xxx')分发action，或者使用mapActions辅助函数将组件的methods映射为store.dispatch调用（需要在根节点注入store）:
		<script>
			import {mapActions} from 'vuex';

			export default {
				//...
				methods: {
					...mapActions: {
						'increment', // 将'this.increment()'映射为'this.$store.dispatch('increment')'

						// 'mapActions' 也支持载荷：
						'incrementBy' // 将'this.incrementBy(amout)'映射为'this.$store.dispatch('incrementBy', amount)'
					},
					...mapActions: {
						add: 'increment' // 将'this.add()'映射为'this.$store.dispatch('increment')'
					}
				}
			}
		</script>

		>> 组合Action
		Action通常是异步的，那么如何知道action什么时候结束呢？更重要的是，我们如何才能组合多个action，以处理更加复杂的异步流程？
		首先，你需要明白store.dispatch可以处理被触发的action的处理函数返回的Promise，并且store.dispatch仍旧返回Promise:
		<script>
			actions: {
				actionA ({commit}) {
					return new Promise((resolve, reject) => {
						setTimeout(() => {
							commit('someMutation');
							resolve();
						}, 1000);
					})
				}
			}

			现在你可以：
			store.dispatch('actionA').then(() => {
				// ...
			});
		</script>

		在另外一个action中也可以：
		<script>
			actions: {
				actionB ({commit}) {
					return dispatch('weactionA').then(() => {
						commit('someOtherMutation');
					});
				}
			}
		</script>

		最后，如果我们利用async/await，我们可以如下组合action:
		<script>
			// 假设getData() 和 getOtherData()返回的是Promise
			actions: {
				async actionA ({commit}) {
					commit('gotData', await getData());
				},
				async actionB ({commit}) {
					await dispatch('actionA');  // 等待actionA完成
					commit('gotOtherData', await getOtherData());
				}
			}
		</script>

	>> Module
		由于使用单一状态树，应用的所有状态会集中到一个比较大的对象。当应用变得非常复杂时，store对象就有可能变得相当臃肿。
		为了解决以上问题，Vuex允许我们将store分割成模块(Module)。每个模块拥有自己的state, mutation, action, getter, 甚至是嵌套子模块--从上到下进行同样方式的分割。
		<script>
			const moduleA = {
				state: {...},
				mutations: {...},
				actions: {...},
				getters: {...}
			}

			const moduleB = {
				state: {...},
				mutations: {...},
				actions: {...}
			}

			const store = new Vuex.Store({
				modules: {
					a: moduleA,
					b: moduleB
				}
			});

			store.state.a  // moduleA的状态
			store.state.b  // moduleB的状态

		</script>		

		>> 模块的局部状态
		对于模块内部的mutation和getter，接收的第一个参数是模块的局部状态对象。
		<script>
			const moduleA = {
				state: {
					count: 0
				},
				mutations: {
					increment (state) {
						// 这里的'State'对象是模块的局部状态
						state.count++;
					}
				},
				getters: {
					doubleCount (state) {
						return state.count*2;
					}
				}
			}
		</script>

		同样，对于模块内部的action，局部状态通过context.state暴露出来，根节点状态则为context.rootState: 
		<script>
			const moduleA = {
				// ...
				actions: {
					incrementIfOddOnRootSum ({state, commit, rootSate}) {
						if ((state.count + rootState.count)%2 === 1) {
							commit('increment');
						}
					}
				}
			}
		</script>

		对于模块内部的getter，根节点状态会作为第三个参数暴露出来：
		<script>
			const moduleA = {
				// ...
				getters: {
					sumWithRootCount (state, getters, rootState) {
						return state.count + rootState.count;
					}
				}
			}
		</script>

		>> 命名空间
		默认情况下，模块内部的action、mutation和getter是注册在全局命名空间的--这样使得多个模块能够对同一mutation和action作出响应。
		如果希望你的模块具有更高的封装度和复用性，你可以通过添加namespaced: true的方式使其成为命名空间模块。当模块被注册后，它的所有getter, action和mutation都会自动模拟模块注册的路径调整命名。例如
		<script>
			const store = new Vuex.Store({
				modules: {
					account: {
						namespaced: true,

						//模块内容（module assets）
						state: {...}, // 模块内的状态已经是嵌套的了，使用'namespaced'属性不会对其产生影响
						getters: {
							isAdmin () {...}  // -> getters['account/isAdmin']
						},
						actions: {
							login () {...} // -> dispatch('account/login')
						}, 
						mutations: {
							login () {...} // -> commit('account/login')
						}
					}

					// 嵌套模块
					modules: {
						// 继承父模块的命名空间
						myPage: {
							state: {...},
							getters: {
								profile () {...} // -> getters['account/profile']
							}
						},

						//进一步嵌套命名空间
						posts: {
							namespaced: true,

							state: {...},
							getters: {
								popular () {...}  // -> getter['account/posts/popular']
							}
						}
					} 
				}
			});
		</script>



[v-model与value.sync机制]: 
