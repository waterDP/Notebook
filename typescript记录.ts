/**
 * 泛型
 */
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

		function logginIdentity<T extends Lenthwise>(arg: T): T {
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

/**
 * 交叉类型
 */
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

/**
 * 联合
 */
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

/**
 * 类型保护与区分类型
 */
  // 类型断言
  let pet1 = getSmallPet();

  if ((<Fish>pet1).swim) {
  	(<Fish>pet1).swim();
  } else {
  	(<Bird>pet1).fly();
  }