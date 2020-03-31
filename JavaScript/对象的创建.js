// todo 1.工厂模式

	function createPerson(name, age, job) {
		let o = new Object();

		o.name = name;
		o.age = age;
		o.job = job;
		o.sayName = function() {
			console.log(this.name);
		}

		return o;
	}

	let person1 = createPerson('Nicholas', 29, 'Software Engineer');
	let person2 = createPerson('Greg', 27, 'Doctor');

// todo 2.构造函数模式

	function Person(name, age, job) {
		this.name = name;
		this.age = age;
		this.job = job;
		this.sayName = function() {
			console.log(this.name);
		}
	}

	let person1 = new Person('Nicholas', 29, 'Software Engineer');
	let person2 = new Person('Greg', 27, 'Doctor');

// todo 3.原型模式

	function Person() {}

	Person.prototype.name = 'Nicholas';
	Person.prototype.age = 29;
	Person.prototype.job = 'Software Engineer';
	Person.prototype.sayName = function() {
		alert(this.name);
	}

	let person1 = new Person();
	person1.sayName();  //"Nicholas"

	let person2 = new Person();
	person2.sayName() //"Nicholas"

	alert(person1.sayName == person2.sayName); // true

// todo 4.组合使用构造函数模式和原型模式

	function Person(name, age, job) {
		this.name = name;
		this.age = age;
		this.friends = ['Shelby', 'Court'];
	}

	Person.prototype = {
		constructor: Person,
		sayName: function() {
			alert(this.name);
		}
	}

	let person1 = new Person('Nicholas', 29, 'Software Engineer');
	let person2 = new Person('Greg', 27, 'Doctor');

	person1.friends.push('Van');
	alert(person1.friends); // 'Shelby, Court, Van'
	alert(person2.friends); // 'Shelby, Court'
	alert(person1.friends === person2.friends); //false;
	alert(person1.sayName === person2.sayName); // true;

// todo 5.动态原型模式
	// 有其它OO语言经验经验的开发人员在看到独立的构造函数和原型时，很可能会感到非常困惑。动态原型式正是致力于解决这个问题的一个方案，
	// 它把所有信息都封装在构造函数中，而通过在构造函数中的初始化原型（仅在必要情况下），又保持了同时使用构造函数和原型的优点。换句
	// 话说，可以通过检查某个应该存在的方法是否有效，来决定是否需要初始化原型。

	function Person(name, age, job) {

		//属性
		this.name = name;
		this.age = age;
		this.job = job;

		// 方法
		if(typeof this.sayName != 'function') {

			Person.prototype.sayName = function() {
				alert(this.name);
			};

		}
	}

	let friend = new Person('Nocholas', 29, 'Software Engineer');
	friend.sayName();

// todo 6.寄生构造函数模式

	function SpecialArray() {
		// 创建数组
		let values = new Array();

		// 添加值
		values.push.apply(values, arguments);

		// 添加方法
		values.toPipedString = function() {
			return this.join('|');
		}

		// 返回数组
		return values;

	}

	let colors = new SpecialArray('red', 'blue', 'green');
	alert(colors.toPipedString());  //'red|blue|green'

// todo 7.稳妥构造函数模式
	// 稳妥构造函数遵循与寄生构造函数类似的模式，但有两点不同：
	// > 一是新创建对象的实例方法不引用this;
	// > 二是不使用new操作符调用构造函数。
	
	function Person(name, age, job) {
		// 创建返回的对象
		let o = new Object();
		// 可以在这里定义私有变量和函数

		// 添加方法
		o.sayName = function() {
			alert(name);
		}

		return o;
	}

