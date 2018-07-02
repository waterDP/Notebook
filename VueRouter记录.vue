=> 安装
	如果在一个模块工程中使用它，必须通过Vue.use()明确的安装路由功能：
	<script>
		import Vue from 'vue';
		import VueRouter from 'vue-router';

		Vue.use(VueRouter);
	</script>

=> 实例
	>> HTML 
		<div id='app'>
			<h1>Hello App!</h1>
			<p>
				<!-- 使用 router-link 组件导航 -->
				<!-- 通过传入 'to' 属性指定链接 -->
				<!-- <router-link> 默认会被渲染成一个 <a> 标签 -->
				<router-link to='/foo'>Go to Foo</router-link>
				<router-link to='/bar'>Go to Bar</router-link>
			</p>
			<!-- 路由出口 -->
			<!-- 路由匹配到的组件将渲染在这里 -->
			<router-view></router-view>
		</div>

	>> JavaScript
		<script>
			// 0.如果使用模块化机制编程，导入Vue和VueRouter，要调用Vue.use(VueRouter)

			// 1.定义（路由）组件
			// 可以从其它文件import 进来
			const Foo = {template: '<div>foo</div>'};
			const Bar = {template: '<div>bar</div>'};

			// 2.定义路由
			// 每个路由应该映射一个组件。其中"component"可以是
			// 通过Vue.extend()创建的组件构造器
			// 或者，只是一个组件配置对象。
			const routes = [
				{ path: '/foo', component: Foo },
				{ path: '/bar', component: Bar }
			];

			// 3.创建router实例，然后传 routes 配置
			const router = new VueRouter({
				routes // (缩写)相当于routes: routes
			});

			// 4.创建和挂载根实例
			// 记得要通过 router 配置参数注入路由
			// 从而让整个应用都有路由功能。
			const app = new Vue({
				router
			}).$mount('#app');
		</script>

=> 动态路由匹配
	我们经常需要把某种模式匹配到所有路由，全都映射到同个组件。例如，我们有一个User组件，对于所有ID各不相同的用户，都要使用这个组件来渲染。那么我们可以在vue-router的路由路径中使用【动态路径参数】(dynamic segment)来达到这个效果：

	<script>
		const User = {
			template: '<div>User</div>'
		}

		const router = new VueRouter({
			routes: [
				// 动态路径参数 以冒号开头
				{ path: '/user/:id', component: User }
			]
		});
	</script>

	现在呢，像/user/foo 和 /user/bar都将映射到相同的路由。
	一个【路径参数】使用冒号 : 标记。当匹配到一个路由时，参数值会被设置到 this.$route.params，可以在每个组合内部使用。于是，我们可以更新User的模板，输入当前用户的ID:
	<script>
		const User = {
			template: '<div>User{{ $route.params.id }}</div>'
		}
	</script>

=> 响应路由参数的变化
	提醒一下，当使用路由参数时，例如从/user/foo 导航到 /user/bar，原来的组件实例会被利用。因为两个路由都渲染同个组件，比起销毁再创建，复用则显得更加高效。不过，这也意味着组件的生命周期钩子不会再被调用。
	复用组件时，想对路由参数的变化作出响应的话，你可以简单地watch（监听变化）$route对象。
	<script>
		const User = {
			template: '...',
			watch: {
				'$route' (to, from) {
					// 对路由变化作出响应
				}
			}
		}
	</script>

	或者使用2.2中引入的beforeRouteUpdate守卫：
	<script>
		const User = {
			template: '...',
			beforeRouteUpdate(to, from, next) {
				// react to route changes
				// don't forget to call next();
			}
		}
	</script>

=> 嵌套路由
	<div id="app">
		<router-view><router-view>
	</div>

	<script>
		const User = {
			template: '<div>User {{ $route.params.id }}</div>'
		}

		const router = new VueRouter({
			routes: [
				{ path: '/user/:id', component: User }
			]
		});
	</script>

	这里的<router-view>是最顶层的出口，渲染最高级路由匹配到组件。同样地，一个被渲染组件同样可以包含自己的嵌套<router-view>。例如，在User组件的模板中添加一个<router-view>:
	<script>
		const User = {
			template: `
				<div class='user'>
					<h2>User {{$route.params.id}}</h2>
					<router-view></router-view>
				</div>		
			`
		}
	</script>

	要在嵌套的出口中渲染组件，需要在VueRouter的参数中使用children配置：
	<script>
		const router = new VueRouter({
			routes: [
				{ path: '/user/:id', component: User,
					children: [
						{
							// 当 /user/:id/profile 匹配成功
							// UserProfile会被渲染在User的<router-view>中
							path: 'profile',
							component: UserFile
						}, 
						{
							// 当 /user/:id/posts 匹配成功
							// UserPosts 会被渲染在User的<router-view>中
							path: 'posts',
							component: UserPosts
						}
					]
				}
			]
		});
	</script>

	要注意，以 / 开头的嵌套路径会被当作根路径。这让你充分的使用嵌套组件而无需设置嵌套路径。
	你会发现，children配置就是像routes配置一样的路由配置数组，所以，你可以嵌套多层路由。
	此时，基于上面的配置，当你访问/user/foo时，User的出口是不会渲染任何东西，这是因为没有匹配到合适的子路由。如果你想要渲染点什么，可以提供一个空的子路由。
	<script>
		const router = new VueRouter({
		  routes: [
		    {
		      path: '/user/:id', component: User,
		      children: [
		        // 当 /user/:id 匹配成功，
		        // UserHome 会被渲染在 User 的 <router-view> 中
		        { path: '', component: UserHome },

		        // ...其他子路由
		      ]
		    }
		  ]
		})
	</script>

=> 编程式的导航
	除了使用<router-link>创建a标签来定义导航链接，我们还可以借助router的实例方法，通过编写代码来实现。
	router.push(location, onComplate?, onAbort?);
	注意：在Vue实例内部，你可以通过$router访问路由实例。因此你可以调用this.$router.push.
	<script>
		//字符串
		router.push('home')
		//对象
		router.push({path: 'home'})
		//命名的路由
		router.push({name: 'user', params: {userId: 123}})
		//带查询参数，变成/register?plan=private
		router.push({ path: 'register', query: {plan: 'private'}});
	</script>

	在2.2.0+，可选的router.push或router.replace中提供onComplate和onAbort回调作为第二个和第三个参数。这些回调将会在导航成功完成（在所有异步钩子被解析之后）或终止（导航到相同的路由，或者在导航完成之前导航到别一个不同的路由）的时候进行相应的调用。

	注意：如果目的地和当前路由相同，只有参数发生的改变（比如从一个用户资料到另一个/user/1 -> /user/2），你需要使用beforeRouteUpdate来响应这个变化（比如抓取用户信息）。

	>router.replace(location, onComplate?, onAbort?);
	跟router.push很像，唯一的不同就是，它不会向history添加新记录，而是像它的名字一样--替换当前的history记录。

	>router.go(n)
	这个方法的参数是一个整数，意思是在history记录中向前进或者向后退多少步，类似window.history.go(n)。

=> 命名路由
	<script>
		const router = new VueRouter({
			routes: [
				{ 
					path: '/user/:userId',
					name: 'user',
					component: User
				}
			]
		})
	</script>\

=> 命名视图
	有时候想同时（同级）展示多个视图，而不是嵌套展示，例如创建一个布局，有 sidebar（侧导航） 和 main（主内容） 两个视图，这个时候命名视图就派上用场了。你可以在界面中拥有多个单独命名的视图，而不是只有一个单独的出口。如果 router-view 没有设置名字，那么默认为 default。

	<router-view class="view one"></router-view>
	<router-view class="view two" name="a"></router-view>
	<router-view class="view three" name="b"></router-view>
	
	一个视图使用一个组件渲染，因此对于同个路由，多个视图就需要多个组件。确保正确使用 components 配置（带上 s）：
	<script>
		const router = new VueRouter({
	  routes: [
		    {
		      path: '/',
		      components: {
		        default: Foo,
		        a: Bar,
		        b: Baz
		      }
	    	}
	  	]
		})
	</script>

=> 重定向 和 别名
	
	>> 重定向
	重定向也是通过routes配置来完成，下面的例子是从/a重定向到/b: 
	<script>
		const router = new VueRouter({
			routes: [
				{ path: '/a', redirect: '/b'}
			]
		})
	</script>
	甚至是一个方法，动态返回重定向目标：
	<script>
		const router = new VueRouter({
			routes: [
				{path: '/a', redirect: to=> {
					// 方法接收目标路径作为参数
					// return 重定向的字符串路径/路径对象
				}}
			]
		});
	</script>

	>> 别名
	 『重定向』的意思是，当用户访问 /a时，URL 将会被替换成 /b，然后匹配路由为 /b，那么『别名』又是什么呢？
			/a 的别名是 /b，意味着，当用户访问 /b 时，URL 会保持为 /b，但是路由匹配则为 /a，就像用户访问 /a 一样。
		上面对应的路由配置为：
			<script>
				const router = new VueRouter({
				  routes: [
				    { path: '/a', component: A, alias: '/b' }
				  ]
				});
			</script>
	 『别名』的功能让你可以自由地将 UI 结构映射到任意的 URL，而不是受限于配置的嵌套路由结构。

=> 路由组件传参
  在组件中使用$route会使之与其对应路由形成高度耦合，从而使组件只能在某些特定的url上使用，限制了其灵活性。

  >与$route耦合 
  <script>
  	const User = {
  		template: '<div>User {{ $route.params.id }}</div>'
  	}
  	const router = {
  		routes: [
  			{ path: '/user/:id', component: User }
  		]
  	}
  </script>

  >使用props解耦
  <script>
  	const User = {
  		props: ['id'],
  		template: '<div>User {{ id }}</div>'
  	}
  	const router = new VueRouter({
  		routes: [
  			{ path: '/user/:id', component: User, props: true},

  			//对于包含命名视图的路由，你必须分别为每个命名视图添加props选项
  			{ 
  				path: '/user/:id'
  				components: { default: User, sideBar: Sidebar },
  				props: { default: true, sideBar: false }
  			}
  		]
  	});
  </script>

=> 导航守卫
	正如其名，vue-router提供的导航守卫主要用来通过跳转或取消的方式守卫导航。有多种机会植入路由导航过程中：全局的，单个路由独享的，或者组件级的。
	记住参数或查询的改变并不会触发进入/离开的导航守卫。你可以通过观察$router对象来应对这些变化，或使用beforeRouteUpdate的组件内守卫。

	全局守卫：
	你可以使用router.beforeEach注册一个全局前置守卫：
	<script>
		const router = new VueRouter({...});
		router.beforEach((to, from, next) => {
			// ...
		});
	</script>
	每一个导航触发时，全局前置守卫按照创建顺序调用。守卫是异步解析执行的，此时导航在所有守卫resolve完之前一直处于等待中。
	每个守卫方法接收三个参数：
		to: Route 即将要进入的目标路由对象。
		from: Route 当前导航正要离开的路由。
		next: Function 一定要调用该方法来resolve这个钩子。执行效果依赖next方法的调用参数。
			next(): 进行管道中的下一个钩子。如果全部钩子执行完了，则导航的状态就是confirmed（确认的）。
			next(false): 中断当前的导航。如果浏览器的URL改变了（可能是用户手动或者浏览器后退按钮），那么URL地址会重置到from路由对应的地址。
			next('/')或者next({path: '/'}): 跳转到不同的地址。当前的导航被中断，然后进行一个新的导航。你可以向next传递任意位置对象，且允许设置诸如replace: true, name: 'home'之类的选项以及任何用在router-link的to prop或 router.push中的选项。
			next(error): (2.4.0+) 如果传入next的参数是一个Error实例，则导航会被终止且该错误会被传递给router.onError()注册过的回调。
		确保要调用next方法，否则钩子就不会被resolved.
		
	>> 全局解析守卫		
	在2.5.0+ 你可以用router.beforeResolve注册一个全局守卫，这和router.beforeEach类似，区别是在导航被确认之前，同时在所有组件内守卫和异步路由组件被解析之后，解析守卫就被调用。

	>> 全局后置钩子
	你也可以注册全局后置钩子，然而和守卫不同的是，这些钩子不会接受next函数也不会改变导航本身：
	<script>
		router.afterEach((to, from) => {
			// ...
		});
	</script>

	>> 路由独享守卫
	你可以在路由配置上直接定义beforeEnter守卫： 
	<script>
		const router = new VueRouter({
			routes: [
				{
					path: '/foo',
					component: Foo,
					beforeEnter: (to, from, next) => {
						// ...
					}
				}
			]
		});
	</script>

	>> 组件内的守卫
	最后，你可以在路由组件内直接定义以下路由导航守卫：
	·beforeRouteEnter
	·beforeRouteUpdate(2.2+)
	·beforeRouteLeave
	<script>
		const Foo = {
			template: '...',
			beforeRouteEnter(to, from, next) {
				/*
					在渲染该组件的对应路由被comfire前调用
					不能获取组件实例 this
					因为当守卫执行的时候，组件实例还没有被创建
				*/
			},
			beforeRouteUpdate(to, from, next) {
				/*
					在当前路由改变，但是该组件被复用时调用
					举例来说，对于一个带有动态参数的路径 /foo/:id, 在/foo/1 和/foo/2之间跳转的时候
					由于会渲染同样的Foo组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
					可以访问组件实例 this
				*/
			},
			beforeRouteLeave(to, from, next) {
				/*
					导向离开该组件对应路由时调用
					可以访问组件实例 this
				*/
			}
		}
	</script>

=> 路由元信息
	定义路由的时候可以定义配置meta字段：
	<script>
		const router = new VueRouter({
			routes: [
				{
					path: '/foo',
					component: Foo,
					children: [
						{
							path: 'bar',
							component: Bar,
							meta: {requiresAuth: true}
						}
					]
				}
			]
		})
	</script>

	那么如何访问这个meta字段呢？
	首先，我们称呼routes配置中的每个路由对象为路由记录。路由记录可以是嵌套的，因此，当一个路由匹配成功后，他可能匹配多个路由记录。例如，根据上面的路由配置，/foo/bar这个UR将会匹配父路由记录以及子路由记录。
	一个路由匹配到的所有路由记录会暴露为$route对象（还有在导航守卫中的路由对象）的$route.matched数组。因此，我们需要遍历$route.matched来检查路由记录中的meta字段。
	下面例子展示在全局导航守卫中检查元字段：
	<script>
		route.beforeEach((to, from, next) => {
			if (to.matched.some(record => record.meta.requiresAuth)) {
				// this route requires auth, check if logged in
				// if not, redirect to login page
				if (!auth.loggedIn) {
					next({
						path: '/login',
						query: {redirect: to.fullPath}
					});
				} else {
					next();
				} 
			} else {
				next();   // 确保一定要调用
			}
		});
	</script>

=> 数据获取
	有时候，进入某个路由后，需要从服务器获取数据。例如，在渲染用户信息时，你需要从服务器获取用户的数据。我们可以通过两种方式来实现：
		1.导航完成之后获取：先完成导航，然后在接下来的组件生命周期钩子中获取数据。在数据获取期间显示显示‘加载中’之类的指示。
		2.导航完成之前获取：导航完成前，在路由进入守卫中获取数据，在数据获取成功后自毁执行导航。

	> 导航完成后获取数据
		当你使用这种方式时，我们会马上导航和渲染组件，然后在组件的created钩子中获取数据。这让我们有机会在数据获取期间展示一个loading状态，还可以在不同视图中展示不同的loading状态：
		假设我们有一个Post组件，需要基于$route.params.id获取文章数据：
		<template>
			<div class="post">
				<div class="loading" v-if='loading'>
					Loading...
				</div>

				<div v-if='error' class='content'>
					<h2>{{post.title}}</h2>
					<p>{{post.body}}</p>
				</div>

				<div v-if='post' clss='content'>
					<h2>{{post.title}}</h2>
					<p>{{post.body}}</p>
				</div>
			</div>
		</template>		

		<script>
			export default {
				data() {
					return {
						loading: false,
						post: null,
						error: null
					}, 
					created() {
						// 组件创建完成后获取数据
						// 此时 data 已经被 observed 了
						this.fetchData();
					},
					watch: {
						// 如果路由发生变化，会再次执行该方法
						$route: 'fatchData'
					},
					methods: {
						fetchData() {
							this.error = this.post = null;
							this.loading = true;

							getPost(this.$route.params.id, (err, post) => {
								this.loading = true;

								if (err) {
									this.error = err.toString();
								} else {
									this.post = post;
								}
							});
						}
					}
				}
			}
		</script>

	> 在导航完成前获取数据
	通过这种方式，我们在导航转入新的路由前获取数据。我们可以在接下来的组件的beforeRouteEnter守卫中获取数据，当数据获取成功后只调用next方法。
	<script>
		export default {
			data() {
				post: null,
				error: null
			},
			beforRouteEnter(to, from, next) {
				getPost(to.params.id, (err, post) => {
					next(vm => vm.setData(err, post))
				})
			},
			// 路由改变前，组件就已经渲染完了。
			// 逻辑稍稍不同
			beforeRouteUpdate(to, from, next) {
				this.post = null;
				getPost(to.params.id, (err, post) => {
					this.setData(err, post);
					next();
				});
			}, 
			methods: {
				setData(err, post) {
					if (err) {
						this.error = err.toString();
					} else {
						this.post = post;
					}
				}
			}
		}
	</script>	
	在为后面的视图获取数据时，用户会停留在当前的界面，因此建议在数据获取期间，显示一些进度条或者别的指示。如果数据获取失败，同样有必要展示一些全局的错误提醒。

	