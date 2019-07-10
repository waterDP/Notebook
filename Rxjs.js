=>RxJS异步事件管理的基本概念如下：
	1.Observable可观察对象：表示一个可调用的未来值或者事件的集合。
	2.Observer观察者：一个回调函数集合，它知道怎样去监听被Obsevable发送的值。
	3.Subscription订阅：表示一个可观察对象的执行，主要用于取消执行。
	4.Operators操作符：纯粹的函数，使得以函数编程的方式处理集合，比如：map,filter,concat,flatMap等这样的操作符来处理集合。
	5.Subject主体：等同于一个事件驱动器（EventEmitter），是将一个值或者事件广播到多个观察者（Observer）的唯一途径。
	6.Schedulers调度器：用来控制并发并且是中央集权的调度员，允许我们在发生计算时进行协调，例如 setTimeout 或 requestAnimationFrame 或其他。

【例1】
	通常你这样注册事件监听
	let button = document.querySelector('button');
	button.addEventListener('click', ()=>{ console.log('Clicked')} );
	使用RxJS创建一个可观察者
	let button = document.querySelector('button');
	Rx.Observable.fromEvent(button, 'click').subscribe(()=>{
		console.log('Clicked');
	});

	>>纯净性 (Purity)
	RxJS能够使用函数的方式生产值的能力使得它强大无比。这意味着你的代码不再那么频繁的出现错误提示。

	通常情况下你会创建一个非纯函数，然后你的代码的其它部分可能搞乱你的程序状态。
	let count = 0;
	let button = document.querySelector('button');
	button.addEventListener('click', ()=>{
		console.log(`Clicked ${++count} times`);
	});

	使用RxJS来隔离你的状态
	let button = document.querySelector('button');

	Rx.Observable.fromEvent(button, 'click')
		.scan(count => count+1, 0)
		.subscribe(count => console.log(`Click ${count} times`));

	scan 操作符的工作原理与数组的 reduce 类似。它需要一个暴露给回调函数当参数的初始值。每次回调函数运行后的返回值会作为下次回调函数运行时的参数。	

	>>流动性 (Flow)
	Rxjs有着众多的操作符，可以帮助你控制事件如何流入可观察对象observables。

 【例】每秒最多只能点击一次的实现，使用纯javascript:
 	let count = 0;
 	let rate = 1000;
 	let lastClick = Date.now() - rate;
 	let button = document.querySelector('button');

 	button.addEventListener('click', ()=>{
 		if(Date.now() - lastClick > rate) {
 			console.log(`Clicked ${++count} times`);
 			lastClick = Date.now();
 		}
 	});

 	使用Rxjs:

 	let button = document.querySelector('button');
 	Rx.Observable.fromEvent(button, 'click')
 	.throttleTime(1000)
 	.scan(count=>count+1,0)
 	.subscribe(count=>console.log(`Clicked ${count} times`));

 	>>值 (Values)
 	你可以通过可观察对象来转化值。
 	下面的程序可以在每次点击鼠标时获取X坐标位置
 	纯JS现实
 	let count = 0;
 	let rate = 1000;
 	let lastClick = Date.now() - rate;
 	let button = document.querySelector('button');

 	button.addEventListener('click', (event)=>{
 		if(Date.now() - lastClick >= rate) {
 			console.log(++count + event.clientX);
 			lastClick = Date.now();
 		}
 	});

 	RxJS实现
 	let button = document.querySelector('button');
 	Rx.Observable.fromEvent(button, 'click')
 	.throttleTime(1000)
 	.map(event => event.clientX)
 	.scan((count, clientX) => count+clientX, 0)
 	.subscribe(count => console.log(count));

 	其它可产生值的操作符有pluck/pairwise/sample等等。

=>Observable可观察对象
	
	下面的例子是一个推送 1,2,3,4数值的可观察对象，一旦它被订阅 1，2，3就会被推送， 4则会在订阅发生一秒之后被推送，
	紧接着完成推送。

	let observable = Rx.Observable.create((observer)=>{
		observer.next(1);
		observer.next(2);
		observer.next(3);
		setTimeout(()=>{
			observer.next(4);
			observer.complete();
		}, 1000);
	});

	调用可观察对象然后得到它所推送的值，我们订阅它，如下：
	console.log('just before subscribe');
	observable.subscribe({
		next: x => console.log('got value'+x),
		error: err => console.log('something wrong occurred'+err),
		complete: () => console.log('done'),
	});
	console.log('just after subscribe');

=> Pull拉取 VS Push推送
	拉和推是数据生产者和数据的消费者两种不同的交流协议（方式）

  >什么是“Pull拉”？在“拉”体系中，数据的消费者决定何时从数据生产者那里获取数据，而生产者自身并不会意识到什么时候数据
	会被发送给消费者。

	每一个JS函数都是一个“拉”体系，函数是数据的生产者，调用函数的代码通过“拉出”一个单一的返回值来消费该数据（return 语句）

	ES6介绍了iterator迭代器和Generator生成器——另一中“拉”体系，调用iterator.next()的代码是消费者，可从中拉取多个值。


	>什么是“Push推”？在推体系中，数据的生产者决定何时发送数据给消费者，消费者不会在接收数据之前意识到它将要接收到数据

	Promise()是当今JS中最常见的Push推体系，一个Promise（数据的生产者s）发送一个resolve value（成功状态的值）来注册一个回调
	（数据消费者），但是不同于函数的地方是：Promise决定何时数据才会被推送至这个回调函数。

	RxJS引入Observable（可观察对象），一个全新的推体系。一个可观察对象是一个产生多值的生产者，并推送给Observer（观察者）

	Function: 是惰性的评估运算，调用时会同步地返回一个单一值。
	Generator（生成器）：是惰性的评估运算，调用时会同步地返回零到（有可能的）无限多个值。
	Promise: 是一个可能（也可能不）返回一个单值的计算。
	Observable: 是惰性的评估运算，它可以从它被调用的时	刻起同步或异步地返回零到（有可能的）无限多个值。

>>>核心的可观察对象概念：
	1.创建 Observables
	2.订阅 Observables
	3.执行 Observables
	4.清理 Observables

	>> 创建 Observables
		Rx.Observable.create 是可观察对象构造函数的别名，它接受一个参数:subscribe 函数。
		下面的例子创造一每秒向观察者发射一个字符串"hi"的可观察对象。

		let observable = Rx.Observable.create((observer)=>{
			let id = setInterval(()=>{
				observer.next('hi');
			}, 1000);
		});

	>>订阅 Observables
		observable.subscribe(x=>console.log(x));
		完全不同于诸如addEventListener/removeEventListener事件语句柄API。使用 observable.subscribe 给定的观察者并没有作为一个监听者被注册。
		可观察对象甚至不保存有哪些观察者。订阅是启动可观察对象执行和发送值或者事件给观察者的简单方式。

	>>执行 Observables
		在Observable.create(function(observer){...})中的代码，表示了一个Observable（可观察对象）的执行，它是惰性运算，只有在每个观察者订阅后才会执行。执行随着时间产生多个值，以同步或者异步的方式。

		Observable执行可以传递三个类型的值：
			~ next: 发送一个数字/字符串/对象等值。
			~ error: 发送一个JS错误或者异常。
			~ complete: 不再发送任何值。 

		一个好方式是，使用try/catch语句包裹通知语句，如果捕获了异常将会发送一个错误通知。
		let observable = Rx.Observable.create((observer) => {
			try{
				observer.next(1);
				observer.next(2);
				observer.next(3);
				observer.complete();
			} catch(err) {
				observer.error(err);
			}
		});

	>>清理 Observables执行
		因为 Observable 执行可能会是无限的，并且观察者通常希望能在有限的时间内中止执行，所以我们需要一个 API 来取消执行。因为每个执行都是其对应观察者专属的，一旦观察者完成接收值，它必须要一种方法来停止执行，以避免浪费计算能力或内存资源。

		当调用了 observable.subscribe ，观察者会被附加到新创建的 Observable 执行中。这个调用还返回一个对象，即 Subscription (订阅)：
		let subscriptions = observable.subscribe(x => console.log(x));
		Subscription表示进行中的执行，它有最小化的API以允许你取消执行，使用 subscription.unsubscrib() 你可以取消进行中的执行：
		let observale = Rx.Observalbe.from([10, 20, 30]);
		let subscription = observable.subscribe(x => console.log(x));

		subscription.unsubscribe();

=>Observer观察者
	什么是观察者？观察者是由 Observable（可观察对象） 发送的值的消费者，观察者简单而言是一组回调函数，分别对应一种被可观察对象发送的通知的类型：next,error和complete。下面是典型的观察者对象的例子：
	let observer = {
		next: x => console.log('Observer got a next value: ' + x);
		error: err => console.error('Observer got an error:' + err);
		complete: () => console.log('Observer got a complete notification');
	}

	要使用观察者，需要把它提供给Obsevale的subscribe方法：
	observable.subscribe(observer);

	在 Observable.subscribe内部，它将使用第一个回调函数作为next的处理句柄创建一个观察者对象。也可以通过三个函数作为参数提供三种回调。

	observable.subscriber(x=>{
		console.log('Observer got a next value:'+x);
	}, err=>{
		console.log('Observer got an error:'+err);
	}, ()=>{
		console.log('Observer got a complete notification');
	});

=>Subscription订阅
	什么是Subscription（订阅）？订阅是一个表示可清理资源的对象，通常是一个可观察对象的执行。订阅对象有一个重要的方法：unsubscribe，该方法不需要参数， 仅仅去废弃掉可观察对象所持有的资源。

	订阅对象也可以放在一起，因些对一个订阅对象的 unsubscribe() 进行调用，可以对多个订阅进行取消。做法是：把一个订阅“加”进另一个订阅。

	let observable1 = Rx.Observable.interval(400);
	let observable2 = Rx.Observable.interval(300);

	let subscription = observable1.subscribe((x) => {
		console.log('first:' + x);
	});
	let childSubscription = observable2.subscribe((x) => {
		console.log('second:' + x);
	});

	subscription.add(childSubscription);

	setTimeout(() => {
		subscription.unsubscribe();
	}, 1000);	


	Subscriptions 还有一个 remove(otherSubscription) 方法，用来撤销一个已添加的子 Subscription 。

=>Subject主体
	什么是Subject？主体是允许值被多播到多个观察者的一种特殊的Observable。然而纯粹的可观察对象是单播的（每一个订阅的观察者拥有单独的可
	观察对象的执行）。

	每个 Subject 都是 Observable 。 - 对于 Subject，你可以提供一个观察者并使用 subscribe 方法，就可以开始正常接收值。从观察者的角度而言，它无法判断 Observable 执行是来自普通的 Observable 还是 Subject 。

	在 Subject 的内部，subscribe 不会调用发送值的新执行。它只是将给定的观察者注册到观察者列表中，类似于其他库或语言中的 addListener 的工作方式。
	
	在Subject的内部，subscribe并不调用一个新的发送值的得执行。它仅仅在观察者注册表中注册给定的观察者，类似于其他库或者语言中的
	addlistener的工作方式。

	每一个Subject都是一个Observer观察者对象。它是一个拥有 next()/error()/complete() 方法的对象。要想Subject提供一个新的值，只需调用
	next()，它将会被多播至用来监听Subject的观察者

	let subject = new Rx.Subject();

	subject.subscribe({
		next(x) {
			console.log('observerA:'+x);
		}
	});

	subject.subscribe({
		next(x) {
			console.log('observerB'+x);
		}
	});

	subject.next(1);
	subject.next(2);

	输出如下:
		// observerA: 1
		// observerB: 1
		// observerA: 2
		// observerB: 2
	
	>>由于Subject也是一个观察者，这就意味着你可以提供一个Subject当做 Obsevable.subscribe() 的参数，如下

	let subject = new Rx.subject();

	subject.subscribe({
		next(x) {
			console.log('observerA:'+x);
		}
	});

	subject.subscribe({
		next(x) {
			console.log('observerB:'+x);
		}
	});

	let observable = Rx.Observable.from([1,2,3]);
	observable.subscrible(subject);

	>>>多播的Observables
		一个“多播的可观察对象”通过具有多个订阅者的Subject对象传递通知。然而一个单纯的“单播可观察对象”通过具有多个订阅者的Subject对象传递
		通知。然而一个单纯的“单播可观察对象”仅仅给一个单一的观察发送通知。

		let source = Rx.Observable.from([1,2,3]);
		let subject = new Rx.Subject();
		let multicasted = source.multicast(subject);

		multicasted.subscribe({
			next(v) {
				console.log('observerA:' + v);
			}
		});

		multicasted.subscribe({
			next(v) {
				console.log('observerB:' + v);
			}
		});

		multicasted.connect();

		multicast方法返回一个看起来很像普通的可观察对象的可观察对象，但是在订阅时却有着和Subject一样的行为，multicast返回一个
		ConnectableObservable, 它只是一个具有connect方法的Observable。

		connect() 方法对于何时开始分享可观察对象的执行是非常重要的。因为 connect() 在source下面有 source.subscribe(subject), connect()
		返回一个Subscription, 你可以取消订阅，以取消共享的Observable执行。

=>引用计数
	
	调用 connect() 手动的处理 subscription是很麻烦的，我们想要第一个观察者到达时自动的链接，并且在最后一个观察者取消订阅后自动的
	取消可观察对象的执行。考虑下面的例子，其中按照此列表的方式进行订阅：
	1.第一个观察者定义多播可观察对象。
	2.多播可观察对象被连接。
	3.next value 0被发送给第一个观察者。
	4.第二个观察者订阅多播可观察对象
	5.next value 1被发送给第一个观察者。
	6.next value 1被发送给第二个观察者。
	7.第一个观察者取消订阅多播可观察对象。
	8.next value 1被发送给第二个观察者。
	9.第二个观察者取消订阅多播可观察对象。
	10.到多播可观察对象的连接被取消。

	我们通过显示的调用 connect() 来实现，如下

	let source = Rx.Observable.interval(500);
	let subject = new Rx.Subject();
	let multicasted = source.multicast(subject);
	let subscription1 , subscription2 , subscriptionConnect;

	subscription1 = multicated.subscribe({
		next(v) {
			console.log('observerA:' + v);
		}
	});
	// 这里我们应该调用connect()，因为multicasted的第一个
	// 订阅者关心消费值
	subscriptionConnect = multicasted.connect();

	setTimeout(() => {
		subscription2 = multicated.subscribe({
			next(v) {
				console.log('observerB' + v);
			}
		});
	}, 600);

	setTimeout(() => {
		subscription1.unsubscribe();
	}, 1200);
	// 这里我们应该取消共享的Obsevable执行订阅
	// 因为此后multicasted将不再有订阅者

	setTimeout(() => {
		subscription2.unsubscribe();
		subscriptionConnect.unsubscribe();   //用于共享的Observable执行
	}, 2000);

	如果不想显式调用 connect()，我们可以使用ConnectableObservable的 refCount()方法（引用计数）,这个方法返回Observable，这个Observable会追踪有多少个订阅者。当订阅者的数量从0变成1，它会调用 connect()以开启共享的执行。当订阅者数量从1变成0时，它会完全取消订阅，停止进一步执行。
	refCount的作用是，当有第一个订阅者时，多播Observable会自动的启动执行，而当最后一个订阅者离开时，多播Observable会自动的停止执行。
	let source = Rx.Observable.interval(500);
	let subject = new Rx.Subject();
	let refCounted = source.multicast(subject).refCount();
	let subscription1, subscription2, subscriptionConnect

	// 这里其实调用了connect()
	// 因为refCount有了第一个订阅者
	console.log('observerA subscribed');
	subscription1 = refCounted.subscribe({
		next(x) {
			console.log(`observerA${x}`);
		}
	});

	setTimeout(() => {
		console.log(`observerB subscribed`);
		subscription2 = refCounted.subscribe({
			next(v) {
				console.log(`observerB subscribed`);
			}
		});
	}, 600);

	setTimeout(() => {
		console.log('observerA unscribed');
		subscription1.unsubscribe();
	}, 1200);

	// 这里共享的Observalbe执行会停止
	// 因为此后refCounted将不再有订阅者
	setTimeout(() => {
		console.log('observerB unsubscribed');
		subscription2.unsubscribe();
	});

	执行结果：
		observerA subscribed
		observerA: 0
		observerB subscribed
		observerA: 1
		observerB: 1
		observerA unsubscribed
		observerB: 2
		observerB unsubscribed

	refCount() 只存在于 ConnectableObservable，它返回的是 Observable，而不是另一个 ConnectableObservable 。

=> BehaviorSubject
	Subject 的其中一个变体就是BehaviorSubject，它有一个“当前值”的概念。它保存了发送给消费者的最新值。并且当有新的观察者订阅时，会立即从BehaviorSubject那接收到“当前值” 。
	在下面的示例中，BehaviorSubject使用值0进行初始化，当第一个观察者订单时会得到 0 。第二个观察者会得到值 2 ，尽管它是在值 2 发送之后订阅的。

	let subject = new Rx.BehaviorSubject(0); // 0是初始值

	subject.subscribe({
		next(v) {
			console.log(`obsevableA ${v}`);
		}
	});

	subject.next(1);
	subject.next(2);

	subject.subscribe({
		next(v) {
			console.log(`observableB ${v}`);
		}
	});

	subject.next(3);

=> ReplaySubject
	ReplaySubject 类似于 BehaviorSubject，它可以发送旧值给新的订阅者，但它还可以记录Observable执行的一部分。
	ReplaySubject 记录 Observable执行中的多个值并将其回放给新的订阅者。
	当创建ReplaySubject时，你可以指定回放多少个值。

	let subject = new Rx.ReplaySubject(3); // 为新的订阅者缓冲3个值

	subject.subscribe({
		next(v) {
			console.log(`observerA: ${v}`);
		}
	});

	subject.next(1);
	subject.next(2);
	subject.next(3);
	subject.next(4);

	subject.subscribe({
		next(v) {
			console.log(`observerB: ${v}`)
		}
	});

	subject.next(5);

	/*
		输出：
			observerA: 1
			observerA: 2
			observerA: 3
			observerA: 4
			observerB: 2
			observerB: 3
			observerB: 4
			observerA: 5
			observerB: 5
	*/

=> AsyncSubject
	AsyncSubject 是另外一个Subject变体，只有当Observable执行完成时（执行 complete() ）, 它才会将执行的最后一个值发送给观察者。

	let subject = new Rx.AsyncSubject();

	subject.subscribe({
		next(v) {
			console.log(`observerA: ${v}`);
		}
	});

	subject.next(1);
	subject.next(2);
	subject.next(3);

	subject.subscribe({
		next(v) {
			console.log(`obseverB: ${v}`);
		}
	});

	subject.next(5);

	subject.complete();

	/*
		输出：
			observerA: 5
			observerB: 5
	*/

	AsyncSubject 和 last()操作符相似，因为它也等于complete通知，以发送一个单个值。


>>> Operators (操作符)

	操作符本质上是一个纯函数（pure Function），它接收一个Observable作为输入，并生成一个新的Observable作为输出。订阅输出Observable同样会订阅输入Observable。在下面的示例中，我们创建一个自定义操作符函数，它将从输入Observable接收的每个值都乘以10；

	function mutilplyByTen(input) {
		let output = Rx.Observable.create(observer => {
			input.subscribe({
				next: (v) => observer.next(10*v),
				error: (err) => observer.error(err),
				complete: () => observer.complete()
			})
		});

		return output;
	}  	

	let input = Rx.Observable.from([1, 2, 3, 4]);
	let output = multiplyByTen(input);
	output.subscribe(x => console.log(x));

	/*
		输出：
			10
			20
			30
			40
	*/
	注意，订阅 output 会导致 input Observable 也被订阅。我们称之为“操作符订阅链”。

>>实例操作符 与 静态操作符
	> 什么是实例操作符？ 通常提到操作符时，我们指的是实例操作符，它是Observable实例上的方法。举例来说，如果上面的multiplayTen是官方提供的实例操作符，它看起来大致是这样子的；
	Rx.Observable.prototype.multiplyByTen = function multiplyByTen() {
		let input = this;
		return Rx.Observable.create(function subscribe(observer) {
			input.subscribe({
				next(v) {
					observer.next(10 * v);
				},
				error(err) {
					observer.error(err);
				},
				complete() {
					observer.complete();
				}
			});
		});
 	}

 	实例运算符是使用 this 关键字来指代输入的 Observable 的函数。

 	$ 注意：这里的input Observable不再是一个函数参数，它现在是this对象。下面是我们如何使用这样的实例运算符；
 	let observable = Rx.Observable.from([1, 2, 3, 4]).multiplyByTen();
 	observable.subscribe(x => console.log(x));

	> 什么是静态操作符？ 除了实例操作符还有静态操作符，它们是直接附加到Observable类上的。静态操作符在内部不使用 this 关键字，而是完全依赖于它的参数。
	静态操作符是附加到Observable类上的纯函数，通常用来从头开始创建Observable。

	最常用的静态操作符是所创建操作符。它们只接收非Obsevable参数，比如数字，然后创建一个新的Observable，而不是将一个输入的Observable转换成输出Observable。

	一个典型的静态操作符例子就是interval函数。它接收一个数字（非Observable）作为参数，并产生一个Observable作为输出。
	let observable = Rx.Observable.interval(1000 /*毫秒数*/);

	然而，有些静态操作符可能不同于简单的创建。一此事组合操作符可能是静态的。比如merge, combineLasted, concat, 等等。这些作为静态运算符是有道理的，因为它们将多个Observable作为输入，而不仅仅是一个，例如：
	let observable1 = Rx.Observable.interval(1000);
	let observable2 = Rx.Observable.interval(400);

	let merged = Rx.Observable.merge(observable1, observable2);


=> Schedulers(调度器)
	什么是调试器？ 调度器控制着何时启动subsription和何时发送通知。它由三部分组分：
		> 调度器是一种数据结构。 它知道如何根据优先级或其它标准来存储任务和将任务进行排序。
		> 调度器是执行上下文。 它表示在何时执行任务（举例来说，立即的，或另一种回调函数机制）。
		> 调度器有一个（虚拟的）时钟。 调试器功能通过它的getter方法 now() 提供了‘时间’的概念。在具体调度器上安排的任务将严格遵守该时钟所表示的时间。

	在下面示例中，我们采用普通Observable，它同步地发送值 1，2，3，并使用操作符observeOn来指定async调度器发送这此值
	let observable = Rx.Observable.create(function (observer) {
		observer.next(1);
		observer.next(2);
		observer.next(3);
		observer.complete();
	}).observeOn(Rx.Scheduler.async);

	console.log('just before subscribe');
	observable.subscribe({
		next(x) {
			console.log(`got vlue ${x}`);
		}, 
		error(err) {
			console.log(`something wrong occurred: ${err}`);
		},
		complete() {
			console.log(`done`)
		}
	});
	console.log(`just after subscribe`);

	/*
		输出结果：
			just before subscribe
			just after subscribe
			got value 1
			got value 2
			got value 3
			done
	*/

	注意通知 got value... 在 just after subscribe 之后才发送，这与我们到目前为止所见的默认行为是不一样的。这是因为 observeOn(Rx.Scheduler.async) 在 Observable.create 和最终的观察者之间引入了一个代理观察者。在下面的示例代码中，我们重命名了一些标识符，使得其中的区别变得更明显：
	let observable = Rx.observable.create(function (proxyObserver) {
		proxyObserver.next(1);
		proxyObserver.next(2);
		proxyObserver.next(3);
		proxyObserver.complete();
	}).observaOn(Rx.Scheduler.async);

	let finalObserver = {
		next(x) {
			console.log(`got value ${x}`);
		},
		error(err) {
			console.log(`something wrong occured: ${err}`);
		},
		complete() {
			console.log('done');
		}
	}

	console.log(`just befor subscribe`);
	observable.subscribe(finalObserver);
	console.log(`just after subscribe`);

	proxyObserver 是在 observeOn(Rx.Scheduler.async)中创建的，它的 next(val) 函数大概是下面这样子的
	let proxyObserver = {
		next(value) {
			Rx.Scheduler.async.shedule({
				x => finalObserver.next(x),
				0, /*延迟时间*/
				value
			});
		},

		// ...
	}

	async 调度器操作符使用了setTimeout或setInterval，即使给定的延迟时间为0。照例，在JavaScript中，我们已知的是 setTimeout(fn, 0) 会在下一次事件循环迭代的最开始运行fn。这也解释了为什么发送给finalObserver的got value 1发生在just after subscribe之后。
	调度器的 schedule() 方法接收一个 delay 参数，它指的是相对于调度器内部的时钟的一段时间。调度器的时钟不需要与实际的挂钟时间有任何关系。这也就是为什么像 delay 这样时间操作符不是实际时间上操作的而是取决于调度器的时钟时间。这在测试中极其有用，可以使用虚拟时间调度来伪伪造挂钟时间，同时实际下是在同步执行计划任务。


>>>转换成observables
	
	// 来自一个或多个值
	Rx.Observable.of('foo', 'bar');

	// 来自数组
	Rx.Observable.fromEvent(document.querySelector('button'), 'click');

	// 来自Promise
	Rx.Observable.fromPromise(fetch('/users'));

	// 来自回调函数（最后一个参数得是回调函数，比如下面的 cb）
	// fs.exists = (patch, cb(exists))
	let exists = Rx.Observable.bindCallback(fs.exists);
	exists('file.txt').subscribe(exists => console.log('Does file exists?', exists));

	// 来自回调函数（最后一个参数得是回调函数，比如下面的cb）
	// fs.rename = (pathA, pathB, cb(err, result))
	let rename = Rx.Observable.bindNodeCallback(fs.rename);
	rename('file.txt', 'else.txt').subscribe(() => {console.log('Renamed!')});

>>>创建observables
	// 在外部产生新事件
	let myObservable = new Rx.Subject();
	myObservable.subscribe(value => console.log(value));
	myObservable.next('foo');

	// 在内部产生新事件 
	let myObsevable = Rx.Observable.create(observable => {
		observable.next('foo');
		setTimeout(() => observable.next('bar'), 1000);
	});	
	myObservable.subscribe(value => console.log(value));

>>>控制流动
 	// 输入 "hello world" 
 	let input = Rx.Observable.fromEvent(document.querySelector('input'), 'input');

 	// 过滤掉小于3个字符长度的目标值
 	input.filter(event => event.target.value.length > 2)
 		.map(event => event.target.value)
 		.subsceibe(value => console.log(value)); //	'hel''

 	// 延迟事件
 	input.delay(200)
 		.map(event => event.target.value)
 		.subscribe(value => console.log(value));

 	// 每200ms只能通过一个事件
 	input.throttleTime(200)
 		.map(event => event.target.value)
 		.subscribe(value => console.log(value));

 	// 停止输入后200ms方能通过最新的那个事件
 	input.debounceTime(200)
 		.map(event => event.target.value)
 		.subscribe(value => console.log(value));

 	// 在3次事件后停止事件流
 	input.take(3)
 		.map(event => event.target.value)
 		.subscribe(value => console.log(value));


 	// 直到其他observable触发事件才停止事件流
 	let stopStream = Rx.Observable.fromEvent(document.querySelector('button'), 'click');
 	input.takeUnitl(stopStream)
 		.map(event => event.target.value)
 		.subscribe(value => console.log(value));

>>>产生值
	// 输入 'hello world'
	let input = Rx.Observable.fromEvent(document.querySelector('input'), 'input');

	// 传递一个新的值
	input.map(event => event.target.value)
		.subscribe(value => console.log(value)); // 'h'

	// 通过提取属性传递一个新的值
	input.pluck('target', 'value')
		.subscribe(value => console.log(value));	
 	
>>>创建应用 
	RxJS是个很好的工具，可以让你的代码更少出错。它是通过使用无状态的纯函数来做这点的。但是应用是有状态的，那么我们如何将RxJS的无状态世界与我们应用的有状态世界连接起来呢？
	我们来创建一个只存储值为 0 的简单状态。每次点击我们想要增加存储在状态中的count。
	let button = document.querySelector('button');

	Rx.Observable.fromEvent(button, 'click');
		// 对流进行scan(reduce)操作，以获取count的值
		.scan(count => count + 1, 0)
		// 每次改变时都在元素上设置count
		.subscribe(count => document.querySelector('#counter').innerHTML = count);
	所以产生状态是在RxJS的世界中完成的，但最后一行代码改变DOM却是一种副作用。

>>>状态和存储（State Store）
	应用使用状态和存储来保持状态。状态存储在不同的框架中有着不同的名字，像store, reduce和model，但重点是它们都只是普能的对象。我们还需要处理的是多个observables可以更新同一个状态存储。
	let increaseButton = document.querySelector('#increase');
	let increase = Rx.Observable.fromEvent(increaseButton, 'click')
		// 我们映射到一个函数，它会改变状态
		.map(() => state => Object.assign({}, state, {count: state.count + 1}));

	// 我们使用初始状态创建了一个对象。每当状态发生变化时，我们会接收状态的函数。
	// 并把状态传递给它。然后返回新的状态并准备在下点击后再次改变状态。
	let state = increase.scan((state, changeEvent) => changeFn(state), {count: 0});

	现在我们还可以再添加几个observables，它们同样也可以更改同一个状态存储。
	let increaseButton = document.querySelector('#increase');
	let increase = Rx.Observable.fromEvent(increaseButton, 'click')\
		// 我们再次映射到一个函数，它会增加count
		.map(() => state => Object.assign({}, state, {count: state.count +1}));

	let inputElement = document.querySelector('#input');
	let input = Rx.Observable.fromElement(inputElement, 'keypress')
		// 我们还是将按键事件映射成一个函数，它会产生一个叫做inputValue状态
		.map(event => state => Object.assign({}, state, {inputValue: event.target.value}));	

	// 我们将这三个改变状态的observables进行合并
	let state = Rx.Observable.merge(increase, decrease, input)
		.scan((state, changeFn) => changeFn(state), {
			count: 0,
			inputValue: ''
		});	

	// 我们订单状态的变化并更新 DOM
	state.subscribe((state) => {
		document.querySelector('#count').innerHTML = state.count;
		document.querySelector('#hello').innerHTML = `Hello ${state.inputValue}`
	});	

	// 为了优化渲染，我们还可以检查什么状态是实际已经发生变化了的
	let preState = {};
	state.subscribe((state) => {
		if (state.count !== prevState.count) {
			document.querySelector('#count').innerHTML = state.count;
		}
		if (state.inputValue !== prevState.value) {
			document.querySelector('#hello').innerHTML = state.inputValue;
		}
		prevState = state;
	});


<Rx.js使用之结合node的读写流进行数据处理>
引入依赖，创建读取与写入流
const https = require('https');
const qureystring = require('querystring');
const Rx = require('rxjs');
const readline = require('readline');
const fs = require('fs');

const imgStream = readline.createInterface({  // 创建行读取流
	input: fs.createReadStream('filelist.txt');
});

const writeStream = fs.createWriteStream('output.txt');  // 创建写入流

使用Rx处理读取并反馈结果给写入
Rx.Observable.fromEvent(imgStream, 'line')  // 将行读取转换为Rx的事件流
	.takeUnitl(Rx.Observable.fromEvent(imgStream, 'close')) // 读取流截断时终止Rx流
	.map(img => generateDate(img)) // 将文件名处理成post的数据
	// 发起请求，并发3个，请求返回后延迟400ms后再进行下一步处理并发起下一个
	.mergeMap(data => requestAPI(data).delay(400), (o, i) => i, 3)
	.subscribe(data => {
		// 处理数据并写入文件
		let str = data.url;
		if (data === 200 && data.data.xxx.length) {
			zzz = data.data.xxx.map(x => x.zzz);
			str += `  ${JSON.stringify(zzz)}`
		}
		writeStream(`${str}\n`);
	}, err => {
		console.log(err);
		console.log('!!!!!ERROR!!!!');
	});

<例> 每隔一秒，输出一个递增的数字（1， 2， 3）	
	import { Observable } from "rxjs";

	const onSubscribe = observer => {
	  let number = 1;
	  const handle = setInterval(() => {
	    observer.next(number++);
	    if (number > 3) {
	      clearInterval(handle);
	    }
	  }, 1000);
	}

	const source$ = new Observable(onSubscribe);

	const theObserver = {
	  next(item) {
	    console.log(item);
	  }
	}

	source$.subscribe(theObserver);

<操作符函数的实现>
	1.返回一个全新的Observable对象。 // 无副作用	
	2.对上游和下游的订阅及退订处理。
	3.处理异常情况。
	4.及时释放资源。

	map 的实现
	function map(project) {
		return new Observable(observer => {
			const sub = this.subscribe({
				next(v) {
					try {
						observer.next(project(v));
					} catch(e) {
						observer.error(e);
					}
				},
				error(e) {
					return observer.error(e);
				}, 
				complete() {
					return observer.complete();
				}
			});
			return {
				unsubscribe() {
					sub.nusubscribe();
				}
			}
		})
	}

	>> 关联Observable
	1.给Observable打补丁
	Observable.prototype.map = map;
	2.使用bind绑定特定Observable对象
	const operator = map.bind(source$);
	const result$ = operator(x => x * 2);

	const result$ = source$::map(x => x * 2)::(x => x + 1);
	3.使用lift
	function map(project) {
		return this.lift(function(source$) {
			return source$.subscribe({
				next(v) {
					try {
						this.next(project(v));
					} catch(e) {
						this.error(e);
					}
				},
				error(e) {
					return this.error(e);
				},
				complete() {
					return this.complete();
				}
			})
		})
	}

	Observable.prototype.map = map;