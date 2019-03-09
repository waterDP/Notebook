/*泛型*/
	function indentity<T>(arg: T): T {
		return arg;
	}
	let output = identity<string>('myString');
	// 类型推论: let output = identity('myString');

	function logginIdentity1<T>(arg: T[]): T[] {
		console.log(arg.length);
		return arg;
	}

	function logginIdentity2<T>(arg: Array<T>): Array<T> {
		console.log(arg.length);
		return arg;
	}

	// 泛型函数
		function identity3<T>(arg: T): T {
			return arg;
		}
		let myIdentity3: <U>(arg: U) => U = identity;

		/**
		 * 我们还可以使用带有调用签名字面量来定义泛型函数
		 * let myIdentity: {<T>(arg: T): T} = indentity;
		 */
	// 泛型接口
		interface GenericIdentityFn<T> {
			<T>(arg: T): T;
		}

		function identity<T>(arg: T): T {
			return arg;
		}

		let myIdentity: GenericIdentityFn<number> = identity;

	// 泛型类
		class GenericNumber<T> {
			zeroValue: T;
			add: (x: T, y: T) => T;
		}

		let myGenericNumber = new GenericNumber<number>();
		myGenericNumber.zeroValue = 0;
		myGenericNumber.add = (x, y) => x + y;

	// 泛型约束
		/**
		 * 创建一个包含.length属性的接口，使用这个接口和extends关键字还实现约束
		 */
		interface Lengthwise {
			length: number;
		}

		function logginIdentity<T extends Lengthwise>(arg: T): T {
			console.log(arg.length);
			return arg;
		}

	// 在泛型约束中使用类型参数
		/**
		 * 你可以声明一个类型参数，且它被另一个类型参数所约束
		 * 比如：
		 * 	   现在我们想要用属性名从对象里获取这个属性。
		 * 	   并且我们想要确保这个属性存在于对象obj上，因此我们需要在这两个类型之类使用约束
		 */
		function getProperty<T, K extends keyof T>(obj: T, key: K) {
			return obj[key];
		}

		let x = {a: 1, b: 2, c: 3, d: 4};

		getProperty(x, 'a'); // okay
		getProperty(x, 'm'); // error: Argument of type 'm' isn't to 'a'|'b'|'c'|'d'

	// 在泛型中使用类类型

		/*在TypeScript使用泛型创建工厂函数时，需要引用构造函数的类类型*/
		function create<T>(c: {new(): T}): T {
			return new c();
		}

		/*一个高级的例子，使用原型属性推断并约束函数与类实例的关系*/
		class BeeKeeper {
			hasMask: boolean;
		}

		class ZooKeeper {
			nametag: string;
		}

		class Animal {
			numLegs: number;
		}

		class Bee extends Animal {
			keeper: BeeKeeper;
		}

		class Lion extends Animal {
			keeper: ZooKeeper;
		}

		function createInstance<A extends Animal>(c: new () => A): A {
			return new c();
		}

		createInstance(Lion).keeper.nametag;
		createInstance(Bee).keeper.hasMask;


  // 对一个key: value 加类型控制
	type Map<T> = {
  	[key: string]: T
	}

	interface PageConfig extends BasicItem {
		pageButtons: Array<Object>
		// ..
	}

	interface BasicItem {
		name: string;
		alias: string;
	}

	export const PAGE_CONFIG: Map<PageConfig> = {};

/*交叉类型*/
 	function extend<T, U>(first: T, second: U): T & U {
 		let result = <T & U>{};
 		for (let id in first) {
 			(<any>result)[id] = (<any>first)[id];
 		}
 		for (let id in second) {
 			if (!result.hasOwnProperty(id)) {
 				(<any>result)[id] = (<any>second)[id];
 			}
 		}
 		return result;
 	}

 	class Person {
 		constructor(public name: string){ }
 	}

 	interface Loggable {
 		log(): void;
 	}

 	class ConsoleLogger implements Loggable {
 		log() {

 		}
 	}

 	let jim = extend(new Person('Jim'), new ConsoleLogger());
 	let n = jim.name;
 	jim.log();

/*联合*/
 	function padLeft(value: string, padding: string | number) {
 		// ...
 	}
 	let indentedString = padLeft('hello world', true);  // error during compilation

 	/*
 		联合类型表示一值可以是几个类型之一。我们用竖线（|）分隔每个类型，所以number|string|boolean表示一个可以是number, string, 或boolean.

 		如果一值是联合类型，我们只能访问此联合类型的所有类型共有的成员。
 	 */

 	interface Bird {
 		fly();
 		layEggs();
 	}

 	interface Fish {
 		swim();
 		layEggs
 	}

 	function getSmallPet(): Fish | Bird {
 		// ...
 	}

 	let pet = getSmallPet();
 	pet.layEggs();  // okays
 	pet.swim();   // errors;

/*类型保护与区分类型*/
  // 类型断言
  let pet1 = getSmallPet();

  if ((<Fish>pet1).swim) {
  	(<Fish>pet1).swim();
  } else {
  	(<Bird>pet1).fly();
  }

/*装饰器*/

  function f() {
  	console.log('f(): evaluated');
  	return function(target, propertyKey: string, descriptor: PropertyDescriptor) {
  		console.log('f(): called');
  	}
  }

  function g() {
  	console.log('g(): evaluated');
  	return function(target, propertyKey: string, descriptor: PropetyDescriptor) {
  		consle.log('g(): called');
  	}
  }

  class C {
  	@f()
  	@g()
  	method() {

  	}
  }

  // 在控制台里会打印出如下结果
  /**
   * f(): evaluated
   * g(): evaluated
   * g(): called
   * f(): called
   */

  /**
   * 装饰器求值
   * 类中不同声明上的装饰器将按以下规定的顺序应用
   * 1.参数装饰器，然后依次是方法装饰器，访问符装饰器，或属性装饰器应用到每个实例成员。
   * 2.参数装饰器，然后依次是方法装饰器，访问符装饰器，或属性装饰器应用到每个静态成员。
   * 3.参数装饰器应用到构造函数。
   * 4.类装饰器应用到类。
   */

  // 类装饰器
  /**
   * 类装饰器表达式会在运行时当作函数被调用，类的构造函数作为其中唯一的参数。
   * 如果类装饰器返回一个值，它会使用提供的构造函数来替换类的声明。
   */

  @sealed
  class Greeter {
  	greeting: string;
  	constructor(message: string) {
  		this.greeting = message;
  	}
  	greet() {
  		return `Hello,${this.greeting}`
  	}
  }

  /**
   * 封闭此类的构造函数和原型
   */
  function sealed(constructor: Function) {
  	Object.seal(constructor);
  	Object.seal(constructor.prototype);
  }

  /**
   * 下面是一个重载的例子
   */
  function classDecorator<T extends {new(...args: any[]): {}}>(constructor: T) {
  	return class extends constructor {
  		newProperty = 'new property';
  		hello = 'override';
  	}
  }

  @classDecorator
  class Greeter {
  	property = 'property';
  	hello: string;
  	constructor(m: string) {
  		this.hello = m;
  	}
  }

  console.log(new Greeter('world'));

  // 方法装饰器
  /**
   * 方法装饰器表达式会在运行时当作函数被调用，传入下列3个参数
   * 1.对于静态成员来说是类的构造函数，对于实例成员来说是类的原型对象
   * 2.成员的名字
   * 3.成员的属性描述符
   */
  // 下面是一个方法装饰器（@enumerable）的例子，应用在Greeter类的方法上
  class Greeter {
  	greeting: string;
  	constructor(message: string) {
  		this.greeting = message;
  	}
  	@enumerable(false)
  	greet() {
  		return `Hello, ${this.greeting}`;
  	}
  }

  /**
   * 这时的@enumerable(false)是一个装饰器工厂。
   * 当装饰器@enumerable(false)被调用时，它会修改属性描述符的enumerable属性
   */
  function enumerable(value: boolean) {
  	return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  		descriptor.enumerable = value;
  	}
  }

  // 访问装饰器
  /**
   * 访问装饰器表达式会在运行时当作函数被调用，传入下列3个参数
   * 1.对于静态成员来说是类的构造函数，对于实例成员是类的原型对象。
   * 2.成员的名字
   * 3.成员的属性描述符
   * 如果访问器装饰器返回一个值，它会被用作方法的属性描述符。
   */
  class Point {
  	private _x: number;
  	private _y: number;
  	constractor(x: number, y: number) {
  		this._x = x;
  		this._y = y;
  	}

  	@configurable(false)
  	get x() {return this._x;}
  	@configurable(true)
  	get y() {return this._y;}
  }

  /**
   * 定义@configurable
   */
  function configurable(value: boolean) {
  	return function (target: any, propertyKey: string, descriptor: PropertyDescriptor){
  		descriptor.configrable = value;
  	}
  }

  // 属性装饰器
  /**
   * 1.对于静态成员来说类是构造函数，对于实例成员是类的原型对象
   * 2.类的成员名字
   * 如果访问装饰器返回一个值，它会被用作方法的属性描述符
   */
  // 我们可以用它来记录这个属性的元数据
  class Greeter {
  	@format('Hello, %s');
  	greeting: string;

  	constructor(message: string) {
  		this.greetion = message;
  	}
  	greet() {
  		let formatString = getFormat(this, "greeting");
  		return formateString.replace("%s", this.greeting);
  	}
  }

  /**
   * 定义@format装饰器和getFormat函数
   */
  import 'reflect-metadata';

  const formatMetadataKey = Symbol('format');

  function format(formatString: string) {
  	return Reflect.metadata(formatMetadataKey, formatString);
  }

  function getFormat(target: any, propertyKey: string) {
  	return Reflect.getMetadata(formatMetadataKey, target, propertyKey);
  }

  // 参数装饰器
  /**
   * 参数装饰器表达式会在运行时当作函数被调用，传入下列3个参数
   * 1.对于静态成员来说是构造函数，对于实例成员是原型对象
   * 2.成员的名称
   * 3.参数在函数参数列表中的索引
   * 【注意】 参数装饰器只能用来监视一个方法的参数是否被传入
   * 参数装饰器的返回值会被忽略
   */
  /*下列定义了参数装饰器（@required）*/
  class Greeter {
  	greeting: string;
  	constructor(message: string) {
  		this.greeting = message;
  	}
  	@validate
  	greet(@required name: string) {
  		return `Hello${name},${this.greeting}`;
  	}
  }

  import 'reflect-metadata';
  const requiredMetadataKey = Symbol("required");

  function required(target: Object, propertyKey: string | symbol, parameterIndex: number) {
  	let existingRequiredParameters: number[] = 
  		Reflect.getOwnMetadata(requiredMetadataKey, target, propertyKey) || [];
  	existingRequiredParameters.push(parameterIndex);
  	Reflect.defineMetadata(requiredMetadataKey, existingRequiredParameters, target, propertyKey);	
  }

  function validate(target: any, propertyName: string, descriptor: TypedPropertyDescriptor<Function>) {
  	let method = descriptor.value;
  	descriptor.value = function() {
  		let requiredParameters: number[] = Reflect.getOwnMetadata(requiredMetadataKey, target, propertyName);
  		if (requiredParameters) {
  			for (let parameterIndex of requiredParameters) {
  				if (parameterIndex >= arguments.length || arguments[parameterIndex] === undefined) {
  					throw new Error("Missing required argument.");
  				}
  			}
  		}

  		return method.apply(this, arguments);
  	}
  }


