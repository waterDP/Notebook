/*设计模式*/

=> 单例模式
	单例模式的定义是：保证一个类仅有一个实例，并提供一个访问它的全局访问点。

	>>实现单例模式
		要实现一个单例模式并不复杂，无非是用一个变量来标志当前是否已经为某个类创建过对象，如果是，则在下一次获取该类的实例时，直接返回之前创建的对象。
		let Singlecton = function(name) {
			this.name = name;
		}

		Singleton.prototype.getName = function() {
			alert(this.name);
		}

		Singleton.getInstance = function(name) {
			if( !this.instance ) {
				this.instance = new Singleton(name);
			}

			return this.instance;
		}

		let a = Singleton.getInstance('sven1');
		let b = Singleton.getInstance('sven2');

		alert(a === b); //true;

		或者：

		let Singleton = function(name) {
			this.name = name;
		}

		Singleton.prototype.getName = function() {
			alert(this.name);
		}

		Singleton.getInstance = (function() {
			let instance = undefined;
			return function(name) {
				if(!instance) {
					instance = new Singleton(name);
				}
				return instance;
			}
		})();

	>>透明的单例
		我们现在的目标是实现一个“透明”的单例类，用户从这个类中创建对象的时候，可以像使用其他任何普通类一样。在下面的这个例子中，我们将使用CreateDiv单例类，它的作用是负责页面中唯一的div节点，代码如下：
		let CreateDiv = (function() {

			let instance = undefined;

			CreateDiv = function(html) {
				if(instance) {
					return instance;
				}

				this.html = html;
				this.init();

				return instance = this;
			} 

			CreateDiv.prototype.init = function() {
				let div = document.createElement('div');
				div.innerHTML = this.html;
				document.body.appendChild(div);
			}

			return CreateDiv;

		})();

		let a = new CreateDiv('sven1');
		let b = new CreateDiv('sven2');

		alert(a === b); //true

	>>用代理实现单例模式
		首先在CreateDiv构造函数中，把负责管理单例的代码移除，使它成为一个普通的创建div的类：
		let CreateDiv = function(html) {
			this.html = html;
			this.init();
		};

		CreateDiv.prototype.init = function() {
			let div = document.createElement('div');
			div.innerHTML = this.html;
			document.body.appendChild(div);
		}

		接下来引入代理类proxySingletonCreateDiv:
		let proxySingletonCreateDiv = (function() {
			let instance = undefined;

			return function(html) {
				if(!instance) {
					instance = new CreateDiv(html);
				}

				return instance;
			}
		})();

		let a = proxySingletonCreateDiv('sven1');
		let b = proxySingletonCreateDiv('sven2');

	>>JavaScript中的单例模式
		作为普通的开发者，我们有必要尽量减少全局变量的使用，即使需要，也要把它的污染降到最低。以下几种方式可以相对降低全局变量带来的命名污染。
		1.使用命名空间
			适当地使用命名空间，并不会杜绝全局命题，但可以减少全局变量的数量。
			最简单的方法依然用对象字面量的方式：
			let namespace1 = {
				a() {
					alert(1);
				},
				b() {
					alert(2);
				}
			}

			我们还可以动态的创建命名空间
			let MyApp = {};
			MyApp.nameSpace = function(name) {
				let parts = name.split('.');
				let current = MyApp;
				for(let i in parts) {
					if(!current[parts[i]]) {
						current[parts[i]] = {}
					}
					current = current[parts[i]];   // 注意, 当前指针前往下一层
				}
			}

			MyApp.nameSpace('event');
			MyApp.nameSpace('dom.style');

			console.dir(MyApp);

			//上述代码等价于
			let MyApp = {
				event: {},
				dom: {
					style: {}
				}
			};

		2.使用闭包封装私有变量
			这种方法把一些变量封装在闭包内部，只暴露一些接口跟外界通信
			let user = (function() {

				let __name = 'sven';
				let __age = 29;

				return {
					getUseInfo: function() {
						return __name + '-' + __age;
					}
				}

			})();

			我们用下划线来约定私有变量__name和__age，它们被封装在闭包产生的作用域中，外部是访问不到这两个变量的，这就避免了对全局的污染。

	>>惰性单例
		惰性单例指的是在需要时候才创建实例。惰性单例是单例模式的重点，这种技术在实际开发中非常有用。
		Singleton.getInstance = (function() {
			let instance = undefined;
			return function() {
				if(!instance) {
					instance = new Singleton(name)
				}

				return instance;
			}
		})();	

	 【惰性单例窗】
		let createLoginLayer = (function() {
			let div = undefined;
			return function() {
				if(!div) {
					div = document.createElement('div');
					div.innerHTML = '我是登录浮窗';
					div.style.display = none;
				}

				return div;
			}
		})();

		document.getElementById('loginBtn').onclick = function() {
			let loginLayer = createLoginLayer();
			loginLayer.style.display = 'block';
		}

	>>通用的惰性单例

		上面我们完成了一个可用的惰性单例，但是我们发现它还有如下的一些问题：
		1.这段代码仍然是违反单一职责原则的，创建对象和管理单例的逻辑都放在createLoginLayer对象内部。
		2.如果我们下次需要创建页面中唯一的iframe，或者script标签，用来跨域请求数据，就必须得如法炮制，把createLoginLayer函数几乎照抄一遍。

		> 管理单例：创建对象的方法fn被当成参数动态传入getSingleton函数
			let getSingleton = function(fn) {
				let result = undefined;
				return function() {
					return result || (result = fn.apply(this, arguments));
				}
			}

		> 创建浮窗
			let createLoginLayer = function() {
				let div = document.createElement('div');
				div.innerHTML = '我是一个浮窗';
				div.style.display = 'none';
				document.body.appendChild(div);
				return div;
			}

			let createSingleLoginLayer = getSingleton(createLoginLayer);

			document.getElementById('loginBtn').onclick = function() {
				let loginLayer = createSingleLoginLayer();
				loginLayer.style.display = 'block';
			}

		> 创建唯一的iframe
			let createIframe = function() {
				let iframe = document.createElement('iframe');
				document.body.appendChild(iframe);
				return iframe;
			}

			let createSingleIframe = getSington(createIframe);

			document.getElementById('loginBtn').onclick = function() {
				let loginLayer = createSingleIframe();
				loginLayer.src = 'http://www.baidu.com';
			} 	

=> 策略模式
	策略模式的定义是：定义一系列的算法，把它们一个个封装起来，并且使它们可以相互替换。

	我们先把每种绩效的计算规则都封装在对应的策略类里面：
		
		let performanceS = function() {};
		performanceS.prototype.calculate = function(salary) {
			return salary*4;
		}

		let performanceA = function() {};
		performanceA.prototype.calculate = function(salary) {
			return salary*3;
		}

		let performanceB = function() {}
		performanceB.prototype.calculate = function(salary) {
			return salary*2;
		}

	接下来定义奖金类Bonus

		let Bonus = function() {
			this.salary = null;   // 原始工资
			this.strategy = null; // 绩效等级对应的策略对象
		};

		Bonus.prototype.setSalary = function(salary) {
			this.salary = salary;   // 设置员工的原始工资
		}

		Bonus.prototype.setStrategy = function(strategy) {
			this.strategy = strategy;  // 设置员工绩效等级对应的策略对象
		}

		Bonus.prototype.getBonus = function() {   // 取得奖金数额
			return this.strategy.caclulate(this.salary);  // 把计算奖金的操作委托给对象的策略对象
		}

	使用：
		let bonus = new Bonus();

		bonus.setSalary(10000);
		bonus.setStrategy(new performanceS()); // 设置策略对象

		console.log(bonus.getBonus()); // 输出：40000

		bonus.setStrategy(new performanceB()); // 设置策略对象
		console.log(bonus.getBonus()); // 输出：30000
	
	>> JavaScript版本的策略模式
		上面，我们让strategy对象从各个策略类中创建而来，这是模拟一些传统面向对象语言的实现。实际上在JavaScript中，函数也是对象，所以更简单和直接的做法是把strategy直接定义为函数：
		let strategies = {
			S(salary) {
				return salary*4;
			},
			A(salary) {
				return salary*3;
			},
			B(salary) {
				return salary*2;
			}
		};

		let calculateBonus = function(level, salary) {
			return strategies[level](salary);
		}

		console.log(calculateBonus('S', 20000)); // 输出：80000
		console.log(calculateBonus('A', 10000)); // 输出：30000

	>> 表单验证
		1.表单验证的第一个版本
			`<html>
				<body>
					<form action="httt://xxx.com/register" id='registerForm' method='post'>
						请输入用户名：<input type='text' name='userName' />
						请输入密码：<input type="text" name='password' />
					</form>
				</body>
			</html>`

			/*javaScript*/
			let registerForm = document.getElementById('registerForm');

			registerForm.onsubmit = function() {
				if (registerForm.userName.value === '') {
					alert('用户名不能为空');
					return false;
				}

				if (registerForm.password.value.length < 6) {
					alert('密码长度不能少于6位');
					return false;
				}
				if (!/(^1[3|5|8][0-9]{9}$)/.test(registerForm.phoneNumber.value)) {
					alert('手机号码格式不正确');
					return false;
				}
			}

			这是一种常见的代码编写方式，它的缺点是：
			1.registerForm.onsubmit函数庞大，包含了很多的if-else语句，这些语句需要覆盖所有的校验规则。
			2.registerForm.onsubmit函数缺乏弹性，如果增加了一种新的校验规则，或者想把密码的长度校验从6改成8，我们都必须深入 registerForm.onsubmit 函数的内部实现，这是违反开放-封闭原则的。
			3.算法的利用性差，如果在程序中增加了另外一个表单，这个表单也需要进行一些类似的校验，那我们很可能将这些校验逻辑处复制得漫天遍野。

		2.用策略模式重构表单校验
			下面我们将用策略模式来重构表彰校验的代码，很显然第一步我们要把这些校验逻辑都封装成策略对象：
			let strategies = {
				isNonEmpty(value, errorMsg) { //不为空
					if ( value === '') {
						return errorMsg;
					}
				},
				minLength(value, length, errorMsg) { //限制最小长度
					if ( value.length < length ) {
						return errorMsg;
					}
				},
				isMobile(value, errorMsg) { //手机号码格式
					if (!/(^1[3|5|8][0-9]{9}$)/.test(value)) {
						return errorMsg;
					}
				}
			}

			接下来我们准备实现Validator类。Valitator类在这里作为Context，负责接收用户的请求并委托给strategy对象。在给出Validator类的代码之前，有必要提前了解用户是如何向Validator类发送请求的，这有助于我们知道如何去编写Validator类的代码。如下：

			let validataFunc = function() {
				let validator = new Validator(); // 创建一个validator对象

				/***** 添加一些校验规则 *****/
				validator.add(registerForm.userName, 'isNonEmpty', '用户名不能为空');
				validator.add(registerForm.password, 'minLength:6', '密码的长度不能少于6位');
				validator.add(registerForm.phoneNumber, 'isMobile', '手机号码格式不正确');

				let errorMsg = validator.start(); //获得校验结果
				return errorMsg; //返回校验结果
			}

			let registerForm = document.getElementById('registerForm');
			registerForm.onsubmit = function() {
				let errorMsg = validataFunc(); //如果errorMsg有确切的返回值，说明未通过校验
				if (errorMsg) {
					alert( errorMsg);
					return false; //阻止表单提交
				}
			}

			从这段代码中可以看到，我们先创建一个validator对象，然后通过 validator.add 方法，往validator对象中添加一些校验规则。validator.add 方法接受3个参数，以下面的这句代码说明：
			validator.add(registerForm.password, 'minLength:6', '密码长度不能少于6位');
			· registerForm.password为参与校验的input输入框。
			· 'minLength:6'是一个以冒号隔开的字符串。冒号前面的minLength代表客户挑选的strategy对象，冒号后面的数字6表示在校验过程中所必需的一些参数。'minLength:6'的意思就是校验 registerForm.password 这个文本输入框的value的最小长度为6。如果这个字符串中不包含冒号，说明校验过程中不需要额外的参数信息，比如'isNonEmpty'。
			· 第3个参数是当校验未通过时返回的错误信息。

			当我们往 validator 对象里添加完一系列的校验规则之后，会调用 validator.start()方法来启动校验。如果 validator.start()返回了一个确切的 errorMsg 字符串当作返回值，说明该次校验没有通过，此时需让 registerForm.onsubmit 方法返回 false 来阻止表单的提交。

			最后是Validator类的实现： 

				let Validator = function() {
					this.cache = []; //保存校验规则
				}

				Validator.prototype.add = function(dom, rule, errorMsg) {
					let ary = rule.split(':');   //把strategy和参数分开
					this.cache.push(function() { // 把校验的步骤用空函数包装起来，并且放入 cache
						let strategy = ary.shift;  // 用户挑选的 strategy
						ary.unshift(dom.value);    // 把 input 的 value 添加进参数列表
						ary.push(errorMsg);  // 把 errorMsg 添加进参数列表
						return strategies[strategy].apply(dom, ary);
					})
				}

				Validator.prototype.start = function() {
					for( let i = 0, validatorFunc; validatorFunc = this.cache(i++); ) {
						let msg = validatorFunc();    // 开始校验，并取得校验后的返回信息
						if (msg) return msg;   //如果有确切的返回值，说明校验没有通过
					}
				}

=> 代理模式
	
	>>虚拟代理实现图片加载
		let myImage = (function() {
			let imgNode = document.createElement('img');
			document.body.appendChild(imgNode);

			return {
				setSrc(src) {
					imgNode.src = src;
				}
			}
		})();

		myImage.setSrc('http://...');

		当网速很慢时，可以看到，在图片被加载好之前，页面中有段长长的空白时间。现在开始引入代理对象proxyImage，通过这个代理对象，在图片被真正加载好之前，页面中将出现一张点位的菊花 loading.gif, 来提示用户图片正在加载。

		let myImage = (function() {
			let imgNode = document.createElement('img');
			document.body.appendChild('imgNode');

			return {
				setSrc(src) {
					imgNode.src = src;
				}
			}
		})();

		let proxyImage = (function() {
			let img = new Image();

			img.onload = function() {
				myImage.setSrc(img.src);
			}

			return {
				setSrc: function (src) {
					myImage.setSrc('file:// /c:/Users/svenzeng/Desktop/load.gif');
					img.src = src;
				}
			}

		})();

		proxyImage.setSrc('http://imgcache.qq.com/music/photo/k/000ggdkow.jpg');

	>>虚拟代理合并HTTP请求
		我们有一些复选框，接下来，给这些复选框绑定绑定点击事件，并且在点击的同时往另一台服务器同步文件
		let synchronousFile = function (id) {
			console.log(`开始同步文件，id为：${id}`)
		};

		let checkbox = document.getElementByTagName('input');

		for(let i=0, c; c = checkbox[i++]; ) {
			c.onclick = function() {
				if (this.checked === true) {
					syncronousFile(this.id);
				}
			}
		};

		代理合并HTTP请求：
		let synchronousFile = function (id) {
			console.log(`开始同步文件，id为：${id}`)
		};

		let proxySynchronousFile = (function () {
			let cache = [],  // 保存一段时间内需要同步的ID
				  timer;       // 定时器

			return function(id) {
				cache.push(id);
				if (timer) {   // 保证不会覆盖已启动的定时器
					return;
				}

				timer = setTimeout(() => {
					synchronousFile(cache.join(',')); // 2秒后向主体发送需要同步的ID集合
					clearTimeout(timer);
					timer = null;
					cache.length = 0; //清空ID集合
				}, 2000);
			}	  
		})();

		let checkbox = document.getElementByTagName('input');

		for (let let i = 0, c; c = checkbox[i++]) {
			c.onclick = function() {
				if(this.checked === true) {
					proxySynchronousFile(this.id);
				}
			}
		}

	>>缓存代理
		1.计算乘积
		先创建一个用于求乘积的函数
		let mult = function () {
			console.log('开始计算乘积');
			let a = 1;
			for (let i =0, l = arguments.length; i < l; i++) {
				a = a*arguments[i];
			}
			return a;
		}	

		mult(2, 3); // 6
		mult(2, 3, 4) // 24

		现在加入缓存代理函数
		let proxyMult = (function() {
			let cache = {};
			return function() {
				let args = Array.prototype.join.call(arguments, ',');
				if (args in cache) {
					return cache[args];
				}

				return cache[args] = mut.apply(this, arguments);
			}
		})();

		proxyMult(1, 2, 3, 4); // 输出：24
		proxyMult(1, 2, 3, 4); // 输出：24

		2.用高阶函数动态创建代理
		通过传入高阶函数这种更加灵活的方式，可以为各种计算方法创建缓存代理。现在这些计算方法被当作参数传入一个专门用于创建缓存代理的工厂中，这样一来，我们就为乘法、加法、减法等创建缓存代理，代码如下：
		/***** 计算乘法 *****/
		let mult = function () {
			let result = 1;
			for (let i = 0, l = arguments.length; i < l; i++){
				result *= arguments[i];
			}
			return result;
		};

		/***** 计算加法 *****/
		let plus = function () {
			let sum = 0;
			for (let i = 0, l = arguments.length; i < l; i++) {
				result += arguments[i];
			}
			return sum;
		}

		/***** 创建缓存代理的工厂 *****/
		let createProxyFactory = function(fn) {
			let cache = {};
			return function () {
				let args = Array.prototype.join.call(arguments, ',');
				if (args in cache) {
					return cache[args];
				}
				return cache[args] = fn.apply(this, arguments);
			}
		}

		let proxyMult = createProxyFactory(mult);
		let proxyPlus = createProxyFactory(plus);

		alert(proxyMult(1,2,3,4));
		alert(proxyMult(1,2,3,4));
		alert(proxyPlus(1,2,3,4));
		alert(proxyPlus(1,2,3,4));

=> 迭代器模式
	迭代器模式是指提供一种方法顺序访问一个聚合对象中的每个元素，而又不需要暴露该对象的内部表示。迭代器模式可以把迭代的过程从业务中分离出来，在使用迭代器模式之后，即使不关心对象的内部构造，也可以按顺序访问其中的每个元素。
	>>实现自己的迭代器
	现在我们来自己实现一个each函数，each函数接受2个参数，第一个为被循环的数组，第二个为循环中的每一步后将被触发的回调函数；

	let each = function(ary, callback) {
		for (let i = 0, l = arg.length; i <	l; i++) {
			callback.call(ary[i], ary[i], i); // 把下标和元素当作参数传给callback函数
		}
	}	

	each([1, 2, 3, 4], (item, index) => {
		alert([index, item]);
	});

	>>>内部迭代与外部迭代
	1.内部迭代
	let compare = function (ary1, ary2) {
		if (ary1.length !== ary2.length) {
			throw new Error('ary1和ary2不相等');
		}
		each(ary1, (item, index) => {
			if (item !== ary2[index]) {
				throw new Error('ary1和ary2不相等');
			}
		});
		alert('ary1和ary2相等')
	};

	compare([1, 2, 3], [1, 2, 4]); // throw new Error('ary1和ary2不相等');

	2.外部迭代
	let Iterator = function (obj) {
		let current = 0;
		let next = function () {
			current++;
		};

		let isDone = function () {
			return current >= obj.length;
		};

		let getCurrItem = function () {
			return obj[current];
		}

		return {
			next: next,
			isDone: isDone,
			getCurrItem: getCurrItem
		}
	}

	改写compare
	let compare = function (iterator1, iterator2) {
		while( !iterator1.isDone() && !iterator2.isDone()) {
			if(iterator1.getCurrItem() !== iterator2.getCurrItem()) {
				throw new Error('iterator1和iterator2不相等');
			}
			iterator1.next();
			iterator2.next();
		}
	}

	let iterator1 = Iterator([1,2,3]);
	let iterator1 = Iterator([1,2,3]);
  compare(iterator1, iterator2);

=> 发布—订阅模式
	发布-订阅模式又叫观察者模式，它定义对象间的一种一对多的依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都将得到通知。在javaScript开发中，我们一般用事件模型替代传统的发布-订阅模式；
	>>自定义一个事件
	let saleOffices = {};
	saleOffices.clientList = [];

	saleOffices.listen = function (fn) {
		this.clientList.push(fn);
	}

	saleOffices.trigger = function () {
		for (let i = 0, fn; fn = this.clientList[i++]; ) {
			fn.apply(this, arguments);
		}
	}


	let saleOffices = {};
	saleOffices.clientList = {};

	saleOffices.listen = function(key, fn) {
		if(!this.saleOffices.clientList[key]){
			this.saleOffices.clientLis[key] = [];
		}
		this.saleOffices.clientList[key].push(fn);
	}

	saleOffices.trigger = function() {
		let key = Array.prototyp.shift.call(arguments);
		let fns = this.clientList[key];
		if(!fns || fns.length === 0) {
			return false;
		}
		for(let i=0, fn; fn = fns[i++]; ) {
			fn.apply(this, arguments);
		}
	}

	>>发布-订阅模式的通用实现
		1.首先我们把发布-订阅的功能提取出来，放在一个单独的对象内：
			let event = {
				clientList: {},
				listen(key, fn) {
					if (!this.clientList[key]) {
						this.clientList[key] = [];
					}
					this.clientList[key].push(fn);
				}, 
				trigger() {
					let key = Array.prototype.shift(arguments);
					let fns = this.clientList[key];
					if(!fns || fns.length === 0) {
						return false;
					}
					for(let i=0, fn; fn = fns[i++]; ) {
						fn.apply(this, arguments);	
					}
				}
			}
		2.再定义一个installEvent函数，这个函数可以给所有对象动态安装发布-订阅功能
			let installEvent = function (obj) {
				for (let i in event) {
					obj[i] = event[i];
				}
			}	

		-> 测试：我们给售楼处对象saleOffices动态增加发布-订阅功能：
			let salesOffices = {};
			installEvent(salesOffices);

			salesOffices.listen('squareMeter88', function(price) {  // 小明订阅消息
				console.log(`价格=${price}`);
			});

			salesOffice.listen('squareMeter100', function(price) {  // 小红订阅消息
				console.log(`价格=${price}`);
			});

			salesOffices.trigger('squareMeter88', 2000000);
			salesOffices.trigger('squareMeter100', 3000000);

	>>取消订阅事件
		event.remove = function(key, fn) {
			let fns = this.clientList[key];

			if (!fns) { // 如果key对应的消息没有被订阅，则直接返回
				return false;
			}

			if (!fn) { // 如果没有传入具体的回调函数，表示需要取消key对应消息的所有订阅
				fns && (fns.length = 0);
			} else {
				for (let l = fns.length-1; l >= 0; l--) {
					let _fn = fns[l];
					if (_fn === fn) {
						fns.splite(l, 1);  // 删除订阅的回调函数
					}
				}
			}
		}	

=> 命令模式
	>命令模式的例子 -- 菜单程序
	let button1 = document.getElementById('button1');
	let button2 = document.getElementById('button2');
	let button3 = document.getElementById('button3');

	let setCommand = function (button, command) {
		button.onclick = function() {
			command.execute();
		}
	};

	let MenuBar = {
		refresh: function () {
			console.log('刷新菜单目录');
		}
	};

	let SubMenu = {
		add: function () {
			console.log('增加子菜单');
		},
		del: function () {
			console.log('删除子菜单');
		}
	};

	在让button变是有用起来之前，我们要先把这些行为都封装在命令之中：
	let RefreshMenuBarCommand = function (receiver) {
		this.receiver = receiver;
	};

	RefreshMenuBarCommand.prototype.execute = function () {
		this.receiver.refresh();
	};

	let AddSubMenuCommand = function (receiver) {
		this.receiver = receiver;
	};

	AddSubMenuCommand.prototype.executed = function () {
		this.receiver.add();
	}

	let DelSubMenuCommand = function () {
		this.receiver = receiver;
	}

	DelSubMenuCommand.prototype.execute = function () {
		console.log('删除子菜单！');
	}

	最后就是把命令接收者传入到command对象中，并且把command对象安装到button上面：
	let refreshMenuBarCommand = new RefreshMenuBarCommand(MenuBar);
	let addSubMenuCommand = new AddSubMenuCommand(SubMenu);
	let delSubMenuCommand = new DelSubMenuCommand(SubMenu);

	setCommand(button1, refreshMenuBarCommand);
	setCommand(button2, addSubMenuCommand);
	setCommand(button3, delSubMenuCommand);

	>>javaScript中的命令模式
	 用闭包实现的命令模式如下代码：
	 let setCommand = function (button, func) {
	 		button.onclick = function () {
	 			func();
	 		}
	 };

	 let MenuBar = {
	 		refresh: function () {
	 			console.log('刷新菜单界面');
	 		}
	 };

	 let RefreshMenuBarCommand = function (receiver) {
	 		return function () {
	 			receiver.refresh();
	 		}
	 };

	 let refreshMenuBarCommand = RefreshMenuBarCommand(MenuBar);
	 setCommand(button, refreshMenuBarCommand);

	 当然，如果想更明确的表达当前正在使用的命令模式，或者除了执行命令之外，将来有可能还要提供撤销命令等操作。那我们最好还是把执行函数改为调用execute方法：
	 let RefreshMenuBarCommand = function (receriver) {
	 		return {
	 			execute: function () {
	 				receiver.refresh();
	 			}
	 		}
	 };

	 let  setCommand = function (button, command) {
	 		button.onclick = function () {
	 			command.execute();
	 		}
	 };

	 let refreshMenuBarCommand = RefreshMenuBarCommand(MenuBar);
	 setCommand(button1, refreshMenuBarCommand);

=> 组合模式
	> 回顾宏命令 （单级树状结构）
	let closeDoorCommand = {
		execute: function() {
			console.log('关门');
		}
	};

	let openPcCommand = {
		execute: function() {
			console.log('开电脑');
		}
	};

	let openQQCommand = {
		execute: function() {
			console.log('登录QQ');
		}
	}; 

	let MacroCommand = function () {
		return {
			commandList: [],
			add: function (command) {
				this.commandList.push(command);
			},
			excute: function () {
				for (let i = 0, command; command = this.commandList[i++]; ) {
					command.execute();
				}
			}
		}
	};

	let macroCommand = MacroCommand();

	macroCommand.add(closeDoorCommand);
	macroCommand.add(openPcCommand);
	macroCommand.add(openQQCommand);

	macroCommand.execute();
	
	> 更强大的宏命令 （多级树状结构）	 
		let MacroCommand = function () {
			return {
				commandList: [],
				add(command) {
					this.commandList.push(command);
				},
				execute() {
					for (let i = 0, command; command = this.commandList[i++]; ) {
						command.execute();
					}
				}
			}
		};

		let openAcCommand = {
			execute() {
				console.log('打开空调');
			}
		};

		/*家里的电视和音箱是连接在一起的，所以可以用一个宏命令来组合打开电视和打开音箱的命令*/
		let openTVCommand = {
			execute() {
				console.log('打开电视');
			}
		};

		let openSoundCommand = {
			execute() {
				console.log('打开音箱');
			}
		};

		let macroCommand1 = MacroCommand();
		macroCommand1.add(openTVCommand);
		macroCommand1.add(openSoundCommand);

		/*关门、打开电脑和登录QQ的命令*/
		let closeDoorCommand = {
			execute() {
				console.log('关门');
			}
		};

		let openPcCommand = {
			execute() {
				console.log('开电脑');
			}
		};

		let openQQCommand = {
			execute() {
				console.log('登录QQ');
			}
		};

		let macroCommand2 = MacroCommand();
		macroCommand2.add(closeDoorCommand);
		macroCommand2.add(openPcCommand);
		macroCommand2.add(openQQCommand);

		/*现在把所有的命令组合成一个'超级命令'*/
		let macroCommand = MacroCommand();
		macroCommand.add(openAcCommand);
		macroCommand.add(macroCommand1);
		macroCommand.add(macroCommand2);

		/*最后给遥控器绑定'超级命令'*/
		let setCommand = (function (command) {
			document.getElementById('button').onclick = function () {
				command.execute();
			}
		})(macroCommand);

	>> 扫描文件夹
		/*--Foloder--*/
		let Folder = function (name) {
			this.name = name;
			this.files = [];
		};

		Folder.prototype.add = function (file) {
			this.files.push(file);
		};

		Folder.prototype.scan = function () {
			console.log(`开始扫描文件夹：${this.name}`);
			for (let i = 0, file, files = this.files; file = files[i++]) {
				file.scan();
			}
		};		

		/*--File--*/
		let File = function (name) {
			this.name = name;
		};

		File.prototype.add = function () {
			throw new Error('文件下面不能再添加文件');
		};

		File.prototype.scan = function () {
			console.log(`开始扫描文件：${this.name}`);
		};

		接下来创建一些文件和文件对象，并且让它们组合成一棵树；
		let folder = new Folder('学习资料');
		let folder1 = new Folder('javaScript');
		let folder2 = new Folder('jQuery');

		let file1 = new File('JavaScript设计模式与开发实践');
		let file2 = new File('精通jQuery');
		let file3 = new File('重构与模式');

		folder1.add(file1);
		folder2.add(file2);

		folder.add(folder1);
		folder.add(folder2);
		folder.add(file3);

		现在的需求是把移动硬盘中的文件和文件夹都复制到这棵树中，假设我们已经得到这些文件对象：
		let folder3 = new Folder('Nodejs');
		let file4 = new File('深入浅出Node.js');
		folder3.add(file4);

		let file5 = new File('JavaScript语言精髓与编程实践！');

		接下来就是把这些文件都添加到原来的树中：
		folder.add(folder3);
		folder.add(file5);

	>> 引用父对象
		let Folder = function(name) {
			this.name = name;
			this.parent = null; //增加this.parent属性
			this.files = [];
		};

		Folder.prototype.add = function(file) {
			file.parent = this;  //设置父对象
			this.files.push(file); 
		};

		Folder.prototype.scan = function() {
			console.log(`开始扫描文件夹：${this.name}`);
			for (let i = 0, file, files = this.files; file = files[i++]; ) {
				file.scan();
			}
		};	

		接下来增加 Folder.prototype.remove方法，表示移除文件夹：
		Folder.prototype.remove = function() {
			if (!this.parent) {
				return;
			}

			for (let files = this.parent.files, l = files.length - 1; l >= 0; l--) {
				let file = files[l];
				if (file === this) { 
					files.splice(l, 1);
				}
			}
		};

		File类的实现基本一致
		let File = function (name) {
			this.name = name;
			this.parent = null;
		};

		File.prototype.add = function() {
			throw new Error('不能添加文件在下面');
		};

		File.prototype.scan = function() {
			console.log(`开始扫描文件：${this.name}`)
		};

		File.prototype.remove = function() {
			if (!this.parent) {
				return;
			}

			for (let files = this.parent.files, l = files.length - 1; l >= 0; l--) {
				let file = files[l];
				if (file === this) {
					files.splice(l, 1);
				}
			}
		}

=> 模板方法模式
	>>咖啡与茶
	1.创建一个抽象父类Beverage
	let Beverage = function() {};

	Beverage.prototype.boilWater = function() {
		console.log('把水煮沸');
	};

	Beverage.prototype.brew = function() {}; //空方法，应该由子类去重写

	Beverage.prototype.pourInCup = function() {}; //空方法，应该由子类重写

	Beverage.prototype.addCondiments = function() {}; //空方法，应该由子类重写

	Beverage.prototype.init = function() {
		this.boilWater();
		this.brew();
		this.pourInCup();
		this.addCondiments();
	};

	2.定义咖啡与茶子类，并让他们继承饮料类；
	let Coffee = function() {};

	Coffee.prototype = new Beverage();

	// 重写方法
	Coffee.prototype.brew = function() {
		console.log('用沸水冲泡咖啡');
	};

	Coffee.prototype.pourInCup = function() {
		console.log('把咖啡倒进茶杯');
	};

	Coffee.prototype.addCondiments = function() {
		console.log('加糖与牛奶');
	};

	let coffee = new Coffee();
	Coffee.init();


	利用好莱坞原则，下面的这段代码可以达到和继承一样的效果
	let Beverage = function(param) {

		let boilWater = function() {
			console.log('把水煮沸');
		};

		let brew = param.brew || function() {
			throw new Error('必须传递brew方法');
		};

		let pourInCup = param.pourInCup || function() {
			throw new Error('必须传递pourInCup方法');
		};

		let addCondiments = param.addCondiments || function() {
			throw new Error('必须传递addCondiments方法');
		}

		let F = function() {};

		F.prototype.init = function() {
			boilWater();
			brew();
			pourInCup();
			addCondiments();
		}	

		return F;

	};

	let Coffee = Beverage({
		brew() {
			console.log('用沸水来泡咖啡');
		},
		pourInCup() {
			console.log('把咖啡倒进杯子里');
		},
		addCondiments() {
			console.log('加糖和牛奶');
		}
	});

	let Tea = Beverage({
		brew() {
			console.log('用沸水来泡茶叶');
		},
		pourInCup() {
			console.log('把茶倒进杯子里');
		},
		addCondiments() {
			console.log('加柠檬');
		}
	});

	let coffee = new Coffee();
	coffee.init();

	let tea = new Tea();
	tea.init();

=> 享元模式
	内部状态与外部状态：
	·内部状态存储于对象内部。
	·内部状态可以被一些对象共享。
	·内部状态独立于具体的场景，通常不会改变。
	·外部状态取决于具体的场景，并根据场景而变化，外部状态不能被共享。

	>>>享元模式下的文件上传
		1.剥离外部状态
		let Upload = function() {
			this.uploadType = uploadType;
		}

		Upload.prototype.init = function(id) {
			uploadManager.setExternalState(id, this); 

			if (this.fileSize < 3000) {
				return this.dom.parentNode.removeChild(this.dom);
			};

			if (window.confirm(`确定要删除文件吗？ ${this.fileName}`)) {
				return this.dom.parentNode.removeChild(this.dom);
			};
		}

		2.工厂进行对象实例化
		let UploadFactory = (function() {
			let createFlyWeightObjs = {};

			return {
				create(uploadType) {
					if (createdFlyWeightObjs[uploadType]) {
						return createdFlyWeightObjs[uploadType];
					}

					return createdFlyWeightObjs[uploadType] = new Upload(uploadType);
				}
			}
		})();

		3.管理器封装外部状态
		let uploadManager = (function() {
			let uploadDatabase = {};

			return {
				add(id, upload, fileName, fileSize) {
					let flyWeightObj = UploadFactory.create(uploadType);

					let dom = document.createElement('div');
					dom.innerHTML = `
						<span>文件名称：${fileName}, 文件大小：${fileSize}</span>
						<button class='delFile'>删除</button>
					`;

					dom.querySelector('.delFile').onclick = function() {
						flyWeightObj.delFile(id);
					};

					document.body.appendChild(dom);

					uploadDatabase[id] = {
						fileName: fileName,
						fileSize: fileSize,
						dom: dom
					};

					return flyWeightObj;
				},
				setExternalState(id, flyWeightObj) {
					let uploadData = uploadDatabase[id];

					for (let i in uploadData) {
						flyWeightObj[i] = uploadData[i];
					}
				}
			}
		})();

		然后是开始触发上传动作的startUpload函数：
		let id = 0;
		window.startUpload = function(uploadType, files) {
			for (let i = 0, file; file = files[i++]; ){
				let uploadObj = uploadManager.add(++id, uploadType, file.fileName, file.fileSize);
			}
		}

=> 职责链模式
	职责链模式的定义是：使多个对象都有机会处理请求，从而避免请求的发送者和接收者之间的耦合关系，将这些对象连成一条链，并沿着这条链传递该请求，直到有一个对象处理它为止。
	>> 灵活可拆分的职责链节点

		> 首先定义热点函数。我们约定，如果某个节点不能处理请求，则返回一个特定的字符串'resolveNext'来表示需要继续往后面传递：
			let order500 = function (orderType, pay, stock) {
				if (orderType === 1 && pay === true) {
					console.log('500元定金预购，得到100元优惠券');
				} else {
					return 'resolveNext';  // 我不知道下一个节点是谁，反正把请求往后面传递
				}
			}

			let order200 = function (orderType, pay, stock) {
				if (orderType === 2 && pay === true) {
					console.log('200元定金预购，得到50优惠券');
				} else {
					return 'resolveNext'; // 我不知道下一个节点是谁，反正把请求往后面传递
				}
			}

			let orderNormal = function (orderType, pay, stock) {
				if (stock > 0) {
					console.log('普通购买，无优惠券');
				} else {
					console.log('手机库存不足');
				}
			}

		> 接下来需要把函数包装进职责链节点，我们定义一个构造函数Chain，在new Chain的时候传递的参数即为需要被包装的函数，同时它还拥有一个实际属性 this.next，表示在链中的下一个节点。
		  此外Chain的prototype中还有函数，它们的作用如下：
			// Chain.prototype.setNext 指定在链中的下一个接点
			// Chain.prototype.resolve 在当前节点运算

			let Chain = function (fn) {
				this.fn = fn;
				this.next = null;
			}	

			Chain.prototype.setNext = function (next) {
				return this.next = next;
			}

			Chain.prototype.resolve = function () {
				let ret = this.fn.apply(this, arguments);  // 执行运算，返回结果
				if (ret === 'resolveNext') {
					return this.next && this.next.resole.apply(this.next, arguments);  // 如果有下一个节点，则执行下一个节点
				}

				return ret;
			}

			> 现在我们把3个订单函数包装成职责链的节点：
			let chainOrder500 = new Chain(order500);
			let chainOrder200 = new Chain(order200);
			let chainOrderNormal = new Chain(orderNormal);

			> 然后指定节点在责任链中的顺序（组装责任链）
			chainOrder500
				.setNext(chainOrder200);
				.setNext(chainOrderNormal);

			> 最后把请求传递给第一个节点
			chainOrder500.resolve(1, true, 500); // 输出：500元定金预购，得到100优惠券
			chainOrder200.resolve(2, true, 500); // 输出：200元定金预购，得到50优惠券
			chainOrderNormal.resolve(1, false, 0); // 输出：手机库存不足

			通过改进，我们可以自由灵活地增加、移除和修改链中的节点顺序，假如某天网站的运营人员又想出了支持300元定金购买，那我们就在该链中增加一个节点即可；
			let order300 = function () {
				// ...
			}

			chainOrder300 = new Chain(order300);
			chainOrder500.setNext(chainOrder300);
			chainOrder300.setNext(chainOrder200);
	>> 异步的职责链模式
		给Chain类再增加一个原型方法 Chain.prototype.setAsyncNode, 表示手动传递请求给下一个职责链中的下一个节点
		Chain.prototype.setAsyncNode = function () {
			return this.next && this.next.resolve.apply(this.next, arguments);
		}	

		let fn1 = new Chain(function () {
			console.log(1);
			return 'nextSucessor'
		});

		let fn2 = new Chain(function () {
			console.log(2);
			setTimeout(() => {
				this.setAsyncNode();
			}, 1000);
		});

		let fn3 = new Chain(function () {
			console.log(3);
		});

		fn1.setNext(fn2).setNext(fn3);
		fn1.resolve();

=> 中介者模式	
	>> 用中介者模式改造泡泡堂游戏
		>首先定义Player构造函数和player对象的原型方法，在Player对象的这些原型方法中，不负责具体的执行逻辑，而是把操作转交给中介者对象，我们把中介者对象命名为playerDirector。
		function Player (name, teamColor) {
			this.name = name; // 角色名字
			this.teamCorlor = teamColor; // 队伍颜色
			this.state = 'alive';  // 玩家生存状态
		};

		Player.prototype.win = function () {
			console.log(this.name + 'won');
		}

		Player.prototype.lose = function () {
			console.log(this.name + 'lost');
		}

		/*玩家死亡*/
		Player.prototype.die = function () {
			this.state = 'dead';
			playerDirector.reciveMessage('playDead', this); // 给中介者发送消息，玩家死亡
		}

		/*移除玩家*/
		Play.prototype.remove = function () {
			playerDirector.reciveMessage('removePlay', this);  // 给中介者发送消息，移除一个玩家
		}

		/*玩家换队*/
		Play.prototype.changeTeam = function (color) {
			playerDirector.reciveMessage('changeTeam', this, color);   // 给中介者发送消息，玩家换队
		}

		let playerFactory = function (name, teamColor) {
			let newPlayer = new Player(name, teamColor);
			playerDirector.reciveMessage('addPlayer', newPlayer); // 给中介者发送消息，新增玩家

			return newPlayer;
		}

		最后，我们需要实现这个中介者playDirector对象，一般有以下两种方式：
		·利用发布—订阅模式。将playerDirector实现为订阅者，各player作为发布者，一旦player的状态发生改变，便推送消息给playerDirector，playerDirector处理消息后将反馈发送给其他player。
		·在playerDirector中开放一些接收消息的接口，各player可以直接调用该接口来给playerDirector发送消息，player只需传递一个参数给playerDirector，这个参数的目的是使playDirector可以识别发送者。同样，playerDrector接收到消息之后会将处理结果反馈给其他player。
		这两种方式的实现没有什么本质上的区别。在这里我们实现第二种方式，playerDirector开放一个对外暴露的接口reciveMessage，负责接收player对象发送的消息，而player对象发送消息的时候，总把自己this作为参数发送给playerDirector，便playerDirector识别消息来自于哪个玩家对象，代码如下：

		let playerDirector = (function () {
			let player = {}, operations = {};  //保存所有玩家，中介者可以执行的操作

			/*新增一个玩家*/
			operations.addPlayer = function (player) {
				let teamColor = player.teamColor; // 玩家的队伍颜色、
				players[teamColor] = players[teamColor] || [];  // 如果该颜色的玩家还没有成立队伍，则新成立一个队伍
				players[teamColor].push(player)  // 添加玩家进入队伍
			};

			/*移除一个玩家*/
			operations.removePlayer = function (player) {
				let teamCorlor = player.teamColor,  //玩家的队伍颜色
						teamPlayer[teamColor] = players[teamColor] || [];  // 该队伍的所有成员
				for (let i = teamPlayer.length -1; i >= 0, i--) {  // 遍历删除
					if (teamPlayer[i] === player) {
						teamplayer.splice(i, 1);
					}
				}		
			}

			/*玩家死亡*/
			operations.playerDead = function (player) {
				let teamColor = player.teamColor,
					 	teamPlayers = player[teamColor];

				let all_dead = true;

				for (let i = 0, player; player = teamPlayers ) {
					if (play.state !== 'dead') {
						all_dead = false;
						break;
					}
				}

				if (all_dead === true) {  // 全部死亡
					for (let i = 0, player; player = teamPlayers[i++]; ) {
						player.lose(); // 本队所有玩家lose
					}

					for (let color in players ) {
						if (color !== teamColor) {
							let teamPlayers = players[color]; // 其他队伍的玩家
							for (let i = 0, player; player = teamPlayers[i++]; ) {
								player.win();    // 其它队伍所有玩家win
							}
						}
					}
				}
			};

			let reciveMessage = function () {
				let message = Array.prototype.shift.call(arguments);  // arguments的第一个参数为消息名称
				operations[messages].apply(this, arguments); 
			};

			return {
				reciveMessage: reciveMessage
			}

		})();

		/*
			我们来看下测试结果：
			// 红队：
			var player1 = playerFactory( '皮蛋', 'red' ),
			player2 = playerFactory( '小乖', 'red' ),
			player3 = playerFactory( '宝宝', 'red' ),
			player4 = playerFactory( '小强', 'red' );
			// 蓝队：
			var player5 = playerFactory( '黑妞', 'blue' ),
			player6 = playerFactory( '葱头', 'blue' ),
			player7 = playerFactory( '胖墩', 'blue' ),
			player8 = playerFactory( '海盗', 'blue' );
			player1.die();
			player2.die();
			player3.die();
			player4.die();
		*/

=> 装饰者模式
	
	定义：给对象动态地增加职责的方式被为装饰都模式

	..模拟传统面向对象语言的装饰者模式	
	假设我们编写一个飞机大战的游戏，随着经验值的增加，我们操作的飞机对象可以升级成更厉害的飞机，一开始这些飞机只能发射普通的子弹，升到第二级时可以发射导弹，升级到第三级时可以发身原子弹。
	下面来看代码实现，首先是原始的飞机类：
	let Plane = function () {}

	Plane.prototype.fire = function () {
		console.log('发射普通子弹');
	}

	接下来增加两个装饰类，分别是导弹和原子弹：
	let MissileDecorator = function (plane) {
		this.plane = plane;
	}

	MissileDecorator.prototype.fire = function () {
		this.plane.fire();
		console.log('发身导弹');
	}

	let AtomDecorator = function (plane) {
		this.plane = plane;
	}

	AtomDecorator.prototype.fire = function () {
		this.plane.fire();
		console.log('发射原子弹');
	}

	/*测试*/
	let plane = new Plane();
	plane = new MissileDecorator(plane);
	plane = new AtomDecorator(plane);

	plane.fire();
	// 分别输出：发身射普通子弹、发射导弹、发射原子弹
	// 
	.. javascript装饰器
	let plane = {
		fire: function () {
			console.log('发射普通子弹')
		}
	};

	let missileDecorator = function () {
		console.log('发射导弹');
	};

	let atomDecorator = function () {
		console.log('发射原子弹');
	};

	let fire1 = plain.fire;

	plain.fire = function() {
		fire1();
		missileDecorator();
	}

	let fire2 = plane.fire;
	plain.fire = function() {
		fire2();
		atomDecorator();
	}

	plain.fire();
	// 分别输出： 发射普通子弹，发射导弹，发射原子弹
	// 
	>> 装饰函数
		javascript中，几乎所有的一切都是对象，其中函数又称为一等对象。在平时的开发工作中，也许大部分时间都在和函数打交道。在JavaScript中可以很方便的给某个对象扩展属性和方法，但却很难在不改动某个函数原代码的情况下，给该函数添加一些额外的功能。在代码运行期间，我们很难切入某个函数的执行环境。

		要想为函数添加一些功能，最简单粗暴的方式就是直接改写该函数，但这是最差的办法，直接违反开放-封闭原则；
		let a = function() {
			alert(1);
		}
		//改成
		a = function() {
			alert(1);
			alert(2);
		}

		很多时候我们不想去碰原函数，也许原函数是由其他同事编写的，里面的实现非常杂乱。甚至在古老的项目中，这个函数的原代码被隐藏在一个我们不愿碰触的一个阴暗角落。 现在需要一个办法，在不改变函数源代码的情况下，能给函数增加功能，这正是开放-封闭原则给我们指出的一条光明道路。


		const a = function() {
			alert(1);
		}

		const _a = a;

		a = function() {
			_a();
			alert(2);
		}

		a();

		这是实际开发中很常见的一种做法，比如我们想给 window 绑定 onload 事件，但是又不确定这个事件是不是已经被其他人绑定过，为了避免覆盖掉之前的 window.onload 函数中的行为，我们一般都会先保存好原先的 window.onload，把它放入新的 window.onload 里执行：0

		window.onload = function() {
			alert();
		}

		let _onload = window.onload || function() {};

		window.onload = function() {
			_onload();
			alert(2);
		}

		这样的代码当然是符合开放封闭原则的，我们在增加新功能的时候，确实没有修改原来的window.onload 代码，但是这种方式存在以下两个问题。
		1.必须维护_onload这个中间变量，虽然看起来并不起眼，但如果函数的装饰较长，或者需要的函数变多，这些中间变量的数量也会越来越多。
		2.其实还遇到了this被劫持的问题，在window.onload的例子中没有这个烦恼，是因为调用变通函数_onload时，this也指向window，跟调用window.onload是一样（函数作为对象的方法被调用时，this指向该对象，所以此处this也只指向window）

	>> 用AOP装饰函数 （AOP面向切面编程）
		首先给出Function.prototype.before 方法和 Function.prototype.after方法：
		Function.prototype.before = function(fn) {
			const _self = this; // 保留原函数的引用；
			return function() {
				/*
				 * 执行新函数，且保证this不被劫持，新函数接受的参数也会原封不动地传入原函数
				 * 新函数在原函数之前执行
				 */
				fn.apply(this, arguments);
				/*
				 * 执行原函数并返回原函数的执行结果
				 * 并且保证this不被劫持
				 */
				return _self.apply(this, arguments);
			}
		}

		Function.prototype.after = function(fn) {
			const _self = this;
			return function() {
				let ret = _self.apply(this, arguments);
				fn.apply(this, arguments);

				return ret;
			}
		}

		window.onload的例子，看看用 Function.prototype.before 来增加新的window.onload
		window.onload = function () {
			alert(2);
		}

		window.onload = (window.onload || function() {}).after(function() {
			alert(2);
		}).after(function() {
			alert(3);
		}).after(function() {
			alert(4);
		});

=> 状态模式
			

		