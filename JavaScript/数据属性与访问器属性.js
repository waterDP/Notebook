ECMAS-262第5版在定义只有内部采用的特性时，提供了描述了属性特征的几种属性。ECMAScript对象中目前存在的属性描述符主要有两种，数据描述符(数据属性)和存取描述符(访问器属性)，数据描述符是一个拥有可写或不可写值的属性。存取描述符是由一对 getter-setter 函数功能来描述的属性。	

& 数据（数据描述符）属性
	数据属性有4个描述内部属性的特性
	[[Configurable]]
	表示能否通过delete删除此属性，能否修改属性的特性，或能否把属性修改为访问器属性，如果直接使用字面定义对象，默认为 true;
	[[Enumerable]]
	表示该属性是否可枚举，即是否通过for-in循环或Object.keys()返回属性，如果直接使用字面值定义对象，默认值为 true;
	[[Writable]]
	能否修改属性的值，如果直接使用字面量定义对象，默认值为 true;
	[[Value]]
	该属性对应的值，默认为undefined

& 访问器（存取描述符）属性
	[[Configurable]]
	和数据属性的[[Configurable]]一样，表示能否通过delete删除此属性，能否修改属性的特性，或能否修改把属性修改为访问器属性，如果直接使用字面量定义对象，默认值为true;
	[[Enumerable]]	
	和数据属性的[[Configurable]]一样，表示该属性是否可枚举，即是否通过for-in循环或Object.keys()返回属性，如果直接使用字面量定义对象，默认值为true;
	[[Get]]
	一个给属性提供 getter 的方法(访问对象属性时调用的函数,返回值就是当前属性的值)，如果没有 getter 则为 undefined。该方法返回值被用作属性值。默认为 undefined；
	[[Set]]
	一个给属性提供 setter 的方法(给对象属性设置值时调用的函数)，如果没有 setter 则为 undefined。该方法将接受唯一参数，并将该参数的新值分配给该属性。默认为 undefined

	1.在使用Object.defineProperty、Object.defineProperties 或 Object.create 函数的情况下添加数据属性，writable、enumerable和configurable默认值为false。
	2.使用对象直接量创建的属性，writable、enumerable和configurable特性默认为true。

>> Object.defineProperty()
方法会直接在一个对象上定义一个新的属性，或者修改一个对象的现有属性，并返回这个对象。如果不指定configurable,
writable,enumerable，则这些属性的默认值为 false, 如果不指定value, get, set， 则这此属性的默认什为 undefined;
Object.defineProperty(obj, prop, descriptor)
obj: 需要被操作的目标对象
prop: 目标对象需要定义或修改的属性的名称
descriptor: 将被定义或修改的属性的描述符

let obj = new Object();

Object.defineProperty(obj, 'name', {
	configurable: false,
	writable: true,
	enumerable: true,
	value: '张三'
})

console.log(obj.name) // 张三

>> Object.defineProperties()
方法直接在一个对象上定义一个或多个新的属性或修改现有的属性，并返回该对象。
Object.defineProperties(obj, props)
obj: 将要被添加属性或修改属性的对象；
props: 该对象的一个或多个键值对定义了将要为对象添加或修改的属性的具体配置；

let obj = new Object();

Object.defineProperties(obj, {
	name: {
		value: '张三',
		configurable: false,
		writeable: true,
		enumerable: true
	},
	age: {
		value: 18,
		configurable: true
	}
});

console.log(obj.name, obj.age); // 张三，18

.. 简易的数据绑定 get set 
`
	<body>
		<p>
			input=>
			<input type="text" id='input1'>
		</p>
		<p>
      input2=>
      <input type="text" id="input2">
    </p>
    <div>
        我每次比input1的值加1=>
        <span id="span"></span>
    </div>
	</body>
`	

let oInput1 = document.getElemenetById('input1');
let oInput2 = document.getElemenetById('input2');
let oSpan = document.getElemenetById('span');

let obj = {};
Object.defineProperties(obj, {
	val1: {
		configurable: true,
		get() {
			oInput1.value = 0;
			oInput2.value = 0;
			oSpan.innerHTML = 0;
			return 0;
		},
		set(newValue) {
			oInput2.value = newValue;
			oSpan.innerHTML = Number(newValue) ? Number(newValue) : 0;
		}
	},
	val2: {
		configurable: true,
		get() {
			oInput1.value = 0;
			oInput2.value = 0;
			oSpan.innerHTML = 0;
			return 0;
		},
		set(newValue) {
			  oInput1.value = newValue;
        oSpan.innerHTML = Number(newValue) + 1;
		}
	}
})

oInput1.value = obj.val1;
oInput1.addEventListener('keyup', () => {
	obj.val1 = oInput1.value;
}, false);
oInput2.addEventListener('keyup', () => {
	obj.val2 = oInput2.value;
}, false);