HTML 中有一类特殊的注释——条件注释，它常用于判断浏览器的版本：
<!--[if IE]>
	<p>Work in IE browser</p>
<![endif] -->

上述方法可以通过使用 JavaScript 判断浏览器版本来替代：
{
	(!!window.ActiveXObject || 'ActiveXObject' in window) ?
	<p>Work in IE browser</p> : ''
}

如果事先知道组件需要的全部属性， JSX 可以这样来写：
const component = <Component name={name} value={value} />;

如果你不知道要设置哪些 props，那么现在最好不要设置它：
const component = <Component />
component.props.name = name;
component.props.value = value;

上述这样是反模式，因为 React 不能帮你检查属性类型（propTypes）。这样即使组件的属性
类型有错误，也不能得到清晰的错误提示。
这里，可以使用 ES6 rest/spread 特性来提高效率：
const data = { name: 'foo', value: 'bar' };
const component = <Component name={data.name} value={data.value} />;
可以写成：
const data = { name: 'foo', value: 'bar' };
const component = <Component {...data} />;

//输入 （JSX）
const person = <Person name={window.isLiggedIn ? window.name: ''} />

//输出 (js)
const person = React.createElement(
	Person,
	{name: window.isLiggedIn ? window.name: ''}
);

子组件了可以作为表达式使用
//输入 （JSX）
const content = <Container>{window.isLoggedIn ? <Nav /> : <Login />}</Container>

//输出 (js)
const content = React.createElement(
	Container,
	null,
	window.isLoggedIn ? React.createElement(Nav) : React.createElement(Login);
);

dangerouslySetInnerHTML: 它的作用就是避免 React 转义字符，在确定必要的情况下可以使用它;
<div dangerouslySetInnerHTML={{__html: 'cc &copy; 2015'}} />

官方在React组件构建上提供了3种不同的方法，React.createClass, ES6 classes 和无状态函数(stateless function).

=> React.createClass;

	import React, {Component} from 'react';

	class Button extends Component {

		constructor(props){
			super(props);
		}

		getDefaultProps() {
		    return {
		      //...  
		    };
		}

		render() {
			const {color, text} = this.props;
			
			return (
				<button className={`btn btn-${color}`}>
					<em>{text}</em>
				</button>
			);
		}

	}

=> ES6 classes
	import React, {Component} from 'react';

	class Button extends Component {
		constructor(props) {
			super(props);
		}

		static defaultProps = {
			color: 'blue',
			text: 'Confirm'
		}

		render() {
			const { color, text} = this.props;

			return (
				<button className={`btn btn-${color}`}>
					<em>{text}</em>
				</button>
			);
		}
	}

=> 无状态函数
	function Button({ color = 'blue', text = 'confirm'}) {
		return (
			<button className={`btn btn-${color}`}>
				<em>{text}</em>
			</button>
		);
	}

=> state 

	/*一个计数器组件*/

	import React, {Component} from 'react';

	class Counter extends Component {

		constructor(props) {
			super(props);

			this.handleClick = this.handleClick.bind(this);

			this.state = {
				count: 0
			}

		}

		handleClick(e) {
			e.proventDefault();

			this.setState({
				count: this.state.count + 1;
			})
		}

		render() {
			return (
				<div>
					<p>{this.state.count}</p>
					<a href='#' onClick={this.handleClick}></a>
				</div>
			);
		}
	}

=> React 生命周期
	componentWillMount
	componentDidMount

	componentWillUnmount


	如果组件自身的 state 更新了，那么会依次执行 shouldComponentUpdate、 componentWillUpdate 、
	render 和 componentDidUpdate。

	shouldComponentUpdate 是一个特别的方法，它接收需要更新的 props 和 state，让开发者增加
	必要的条件判断，让其在需要时更新，不需要时不更新。因此，当方法返回 false 的时候，组件
	不再向下执行生命周期方法。

	componentWillUpdate 和 componentDidUpdate 这两个生命周期方法很容易理解，对应的初始化
	方法也很容易知道，它们代表在更新过程中渲染前后的时刻。此时，我们可以想到 componentWillUpdate 
	方法提供需要更新的 props 和 state，而 componentDidUpdate 提供更新前的 props 和state。

	如果组件是由父组件更新 props 而更新的，那么在 shouldComponentUpdate 之前会先执行
	componentWillReceiveProps 方法。此方法可以作为 React 在 props 传入后，渲染之前 setState 的
	机会。在此方法中调用 setState 是不会二次渲染的。

	然后，在 tab 点击事件上，对是否存在 defaultActiveIndex prop 进行判断即可达到在传
	入 defaultActiveIndex 时使用内部更新，当传入 activeIndex 时使用外部传入的 props 更新。
	相关代码如下：

	handleTabClick(activeIndex) {
		const prevIndex = this.state.activeIndex;

		if(this.state.activeIndex !== activeIndex && 'defaultActiveIndex' in this.props) {
			this.setState({
				activeIndex,
				prrevIndex,
			});
		}

		this.props.onChange({activeIndex, prevIndex});
	}

=>ReactDOM
	findDomNode, unmountComponentAtNode, render;

	1.findDomNode:
			当组件被渲染到 DOM 中后， findDOMNode 返回该 React 组件实例相应的 DOM 节点。它可以
		用于获取表单的 value 以及用于 DOM 的测量。例如，假设要在当前组件加载完时获取当前 DOM，
		则可以使用 findDOMNode：

		import React, {Component} from 'react';
		import ReactDOM from 'react-dom';

		class App extends Component {
			
			componentDidMount() {
				const dom = ReactDOM.findDOMNode(this);
			}

			render() {

			}

		}
	2.render

		ReactComponent render(ReactElement element, DOMElement container, [function callback]);

		const myAppInstance = ReactDOM.render(<App />, document.getElementById('root'));

		stopPropagation(), stopPreventDefault()


=>事件
	$$ 在React中使用原生事件
		import React, {Component} from 'react';

		class NativeEventDmo extends Component {

			componentDidMount() {
				this.refs.button.addEventListener('click', (e) => {
					this.handleClick(e);
				})     
			}

			handleClick(e) {
				console.log(e);
			}

			componentWillUnmount() {
			 	this.refs.button.removeEventListener('click');     
			}

			render() {
				return (
					<button ref="button">Test</button>
				);
			}

		}

	$$合成事件与原生事件混用

	import React, {Component} from 'react';

	class QrCode extends Component {

		constructor(props) {
			super(props);

			this.handleClick = this.handleClick.bind(this);
			this.handleClickQr = this.handleClickQr.bind(this);

			this.state = {
				active: false
			}
		}

		componentDidMount() {
			document.body.addEventListener('click', (e)=> {
				this.setState({
					active: false
				})
			})
		}

		componentWillUnmount() {
		 	document.body.removeEventListener('click');   
		}

		handleClick() {
			this.setState({
				active: !this.state.active;
			})
		}

		handleClickQr(e) {
			e.stopPropagation();
		}

		render() {
			return (
				<div>
					<button className='qr' onClick={this.handleClick}>二维码</button>
					<div
						className='code'
						style={{display: this.state.active? 'block': 'none'}}
						onClick={this.handleClickQr}
					>
					<img src='qr.jpg' alt='qr' />
				</div>
			);
		}
	}

	/*
		逻辑似乎很简单，但 React 所表现的似乎与你所想的并不一致，实际效果是在你点击二维码
	区域时二维码依然会隐藏起来。原因也很简单，就是 React 合成事件系统的委托机制，在合成事
	件内部仅仅对最外层的容器进行了绑定，并且依赖事件的冒泡机制完成了委派。也就是说，事件
	并没有直接绑定到 div.qr 元素上，所以在这里使用 e.stopPropagation() 并没有用。当然，解决
	方法也很简单。
	*/

	$$不要将合成事件与原生事件混用
	componentDidMount() {
		document.body.addEventListener('click', (e)=>{
			this.setState({
				active: false;
			})
		});

		document.querySelector('.code').addEventListener('click', (e)=>{
			e.stopPropagation();
		})     
	}

	componentWillUnmount() {
		document.body.removeEventListener('click');
		document.querySelector('.code').removeEventListener('click');
	}


	$$通过e.target判断来避免
	componentWillUnmount() {
		document.body.addEventListener('click', (e)=>{
			if(e.target. && e.target.matches('div.code')) {
				return;
			}

			this.setState({
				active: false
			});
		})
	}


=>表单 
	1.文本框

	import React, {Component} from 'react';

	class App extends Component {

		constructor(props) {
			super(props);

			this.handleInputChange = this.handleInputChange.bind(this);
			this.handleTextareaChange = this.handleTextareaChange.binde(this);

			this.state = {
				inputValue: '',
				textareaValue: '',
			}
		}

		handleInputChange(e) {
			this.setState({
				inputValue: e.target.value;
			})
		}

		handleTextareaChange(e) {
			this.setState({
				textareaValue: e.target.value;
			})
		}

		render() {
			return (
				const {inputValue,textareaValue} = this.state;

				<div>
					<p>
						单行输入框:
						<input type='text' value={inputValue}
									 onChange={this.handleInputChange}
						/>
					</p>						
					<p>
						多行输入框：
						<textarea value={textareaValue}
											onChange={this.handleTextareaChange}
						></textarea>
					</p>
				</div>
			);
		}
	}

	2.单选按钮与复选框

	import React, {Component} from 'react';

	class App extends Component {

		constructor(props) {
			super(props);

			this.handeChange = this.hangeChange.bind(this);

			this.state = {
				radioValue: ''
			}
		}

		handeChange(e) {
			this.setState({
				radioValue: e.target.value;
			})
		}

		render() {
      const {radioValue} = this.state;

			return (
				<div>
					<p>gender:</p>
					<label>
						male:
						<input type='radio'
									 value='male'
									 checked={radioValue === 'male'}
									 onChange={this.handleChange}
						/>
					</label>
					<label>
						female:
						<input type='radio'
								   value='female'
								   checked={radioValue == 'female'}
								   onChange={this.handleChange}
						/>
					</label>
				</div>
			);
		}

	}


$$ 非受控组件

	import React, {Component} from 'react';

	class App extends Component {

		constructor(props){
			super(props);

			this.handleSubmit = this.handleSubmit.bind(this);
		}

		handleSubmit(e) {
			e.proventDefault();

			const { value } = this.refs.name;
			console.log(value);
		}

		render() {
			return (
				<form onSubmit={this.handleSubmit}>
					<input ref='name' type='text' defaultValue='hangzhou' />
					<button type='submit'>Submit</button>
				</form>
			);
		}
	}

	/*	使用受控组件最令人头疼的就是，我们需要为每个组件绑定一个 change 事件，并且定义一
	个事件处理器来同步表单值和组件的状态，这是一个必要条件。当然，在某些简单的情况下，也
	可以使用一个事件处理器来处理多个表单域：*/

	import React, {Component} from 'react';

	class FormApp extends Component {

		constructor(props){
			super(props);

			this.state = {
				name: '',
				age: 18,
			}
		}

		handleChange(name, e) {
			const {value} = e.target;
			this.setState({
				[name]: value,
			});
		}

		render() {
			return (
				<div>
					<input type='text' value={name} onChange={this.handleChange.bind(this, 'name')} />
					<input type='text' value={name} onChange={this.handleChange.bind(this, 'age')} />
				</div>
			);
		}

	}

=>样式处理
	
	1.状态属性
	const style = {
		color: 'white',
		backgroundImage: `url(${imgUrl})`,
		// 注意这里大写的 W，会转换成 -webkit-transition
		WebkitTransition: 'all',
		// ms 是唯一小写的浏览器前缀
		msTransition: 'all',
	};
	const component = <Component style={style} />;

	2.使用classnames库
	import React, {Component} from 'react';
	import classNames from 'classnames'

	class Button extends Component {
		return () {
			const btnClass = classnames({
				'btn': true,
				'btn-pressed': this.state.isPressed,
				'btn-over': !this.state.isPressed && this.state.inHovered,
			})

			return <button className={btnClass}>{this.props.label}</button>
		}
	}


=>组件间通信
	
	$$ 父组件向子组件通信
	
	import React, {Component} from 'react';

	function ListItem({value}){
		return (
			<li>
				<span>{value></span>
			</li>
		);
	}

	function List({list, title}) {
		return (
			<ListTitle title={title}>
			<ul>
				{list.map((entry, index) => (
					<ListItem key={`list-${index}`} value={entry.text} />
				))}
			</ul>
		);
	}


	$$子组件向父组件通信

		1.利用回调函数 2.利用自定义事件机制 

	$$ 跨级组件通信

		当需要让子组件跨级访问信息时，我们可以像之前说的方法那样向更高级别的组件层层传递
	props，但此时的代码显得不那么优雅，甚至有些冗余。在 React 中，我们还可以使用 context 来
	实现跨级父子组件间的通信：

		class ListItem extends Component {

			static contextTypes = {
				color: PropTypes.string
			};

			constructor(props) {
				super(props);
			}

			render() {
				const {value} = this.props;

				return (
					<li style={{background: this.context.color}}>
						<span>{value}</span>
					</li>
				);
			}
		}

		class List extends Component {
			static childContextTypes = {
				color: PropTypes.string,
			}

			getChildContext() {
				return {
					color: 'red'
				}
			}

			render() {
				return (
					<div>
						{list.map((entry, index)=>(
							<listItem key={`list-${index}` value={entry.text} />
						))}
					</div>
				);
			}
		}

	$$没有嵌套关系的组件通信

		
		对于 React 使用的场景来说， EventEmitter 只需要单例就可以了，因此我们需要单独初始化
		EventEmitter 实例：
		
		import { EventEmitter } from 'events'

		export default new EventEmitter();

		然后把EventEmitter实例输出到各组件中使用

		import ReactDOM from 'react-dom';
		import React, {Component, PropTypes} from 'react';
		import emitter from './events'

		class ListItem extends Component {

			static defaultProps = {
				checked: false
			}

			constructor(props) {
				super(props)
			}

			render() {
				return (
					<li>
						<input type="checkbox" checked={this.props.checked} onChange={this.props.onChange} />
						<span>{this.props.value}</span>
					</li>
				);
			}

		}

		class List extends Component {

			constructor(props){
				super(props);

				this.state = {
					list: this.props.list.map(entry => ({
						text: entry.text,
						checked: entry.checked || false
					}))
				}
			}

			onItemChange(entry) {
				const {list} = this.state;

				this.setState({
					list: list.map(preEntry => ({
						text: preEntry.text,
						checked: prevEntry.text == entry.text ? !prevEntry.checked : prevEntry.checked,
					}))
				})

				emitter.emit('ItemChange', entry);
			}

			render() {
				return (
					<div>
						<ul>
							{this.state.list.map((entry, index) => (
								<ListItem key={`list-${index}`}
													value={entry.text}
													checked={entry.checked}
													onChange={this.onItemChange.bind(this, entry)}
								/>
							))}
						</ul>
					</div>
				);
			}
		}

		class App extends Component {

			componentDidMount() {
				this.itemChange = emitter.on('ItemChange', (data) => {
					console.log(data);
				});
			}

			componentWillUnmount() {
				emitter.removeListener(this.itemChange);
			}

			render() {
				return (
					<List list={[{text: 1}, {text: 2}]} />
				);
			}
		}



=>组件间抽象

	$$mixin 在React中使用mixin

	import React from 'react';
	import PureRenderMixin from 'react-addons-purse-render-mixin';

	React.createClass({
		mixins: [PureRenderMixin],
		render() {
			return <div>foo</div>
		}
	});

	$$高阶组件
		实现高阶组件的方法有两种：
		属性代理：高阶组件通过被包裹的React组件来操作props。
		反向继承：高阶组件继承于被包裹的React组件。

pureRender

import React, {Component} from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

class App extends Component {
	constructor(props) {
		super(props);

		this.sholdCOmponentUpdata = PureRenderMixin.shouldComponentUpdata.bind(this);
	}

	render() {
		return <div className={this.props.className}>foo</div>
	}
}

$$ React 源码解析

=> createElement
//createElement 只是做了简单的参数修正，返回一个ReactElement实例对象。
//也就是虚拟元素的对象
ReactElement.createElement = function(type, config, children){
	//初始化参数
	var propName;
	var props = {};
	var key = null;
	var ref = null;
	var self = null;
	var source = null;

	//如果存在config,则提取里面的内容
	if(config != null) {
		ref = config.ref === undefined ? null : config.ref;
		key = config.key === undefined ? null : ''+config.key;
		self= config.__self === undefined ? null : config.__self;
		source = config.__source === undefined ? null : config.__source; 
		//复制config里的内容到props(如id和className等)  
		for(propName in config) {
			if(config.hasOwnProperty(propName) &&
				!RESERVED_PROPS.hasOwnProperty(propName)) {
				props[propName] = config[propName];
			}
		}
	}

	//处理children,全部挂载到props的children属性上。如果只有一个参数，直接赋值给children,
	//否则做合并处理
	var chilrenLength = arguments.length - 2;
	if(childrenLength === 1) {
		props.children = chilren;
	} else if(childrenLength > 1) {
		var childArray = Array(chilrenLength);
		for(var i=1; i < childrenLenght; i++) {
			childArray[i] = arguments[i+2];
		}
		props.chilren = childArray;
	}

	//如果某个prop为空且存在默认的prop，则将默认的prop赋给当前的prop
	if(type && type.defaultProps) {
		if (typeof props[propName] === 'undefined') {
			props[propName] = defaultProps[propName];
		}
	}

	//返回一个ReactElement实例对象
	return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
}

=>生命周期
	
	不同状态下的生命周期
	-> 当首次挂载组件时
		getDefaultProps
		getInitialState
		componentWillMount
		render
		componentDidMount
	-> 当卸载组件时
		componentWillUnmount
	-> 当重新挂载组件时
		getInitialState
		componentWillMount
		render
		componentDidMount
	-> 当再次渲染组件时，组件接受到更新状态，此时按顺序执行
		componentWillReceiveProps
		shouldComponentUpdate
		componentWillUpdate
		render
		componentDidUpdate

	当使用ES6 classes 构建React组件时，static defaultProps = {}， 其实就是调用内部的getDefaultProps方法，
	constructor中的this.state = {}其实就是调用内部的getInitialState方法。

	$$挂载或卸载过程
	1.组件的挂载
	组件挂载是最基本的过程，这个过程主要做组件状态的初始化。我们推荐以下面的例子为模板写组件的初始化：

	import React, {Component, PropType} from 'react';

	class App extends Component {

		static propTypes = {
			//...
		}

		static defaultProps = {
			//...
		}

		constructor(props) {
			super(props);

			this.state = {
				//...
			};

		}

		componentWillMount() {
			//...
		}

		componentDidMount() {
			//...
		}

		render() {
			return <div>This is a demo.</div>
		}

	}

	2.组件的卸载
	组件的卸载非常简单，只有componentWilUnmount这一个卸载前状态。

	import React, {Component} from 'react';

	class App extends Component {

		componentWillUnmount() {
		  //...  
		}

		render() {
			return <div>This is a demo.</div>
		}
	}

	$$数据更新过程

	更新过程指的父组件向下传递props或组件自身执行setState方法时发生的一系列更新动作。

	import React, {Component} from 'react';

	class App extends Component {

		componentWillReceiveProps(nextProps) {
			// this.setState({})
		}

		shouldComponentUpdate(nextProps, nextState) {
			// return true;
		}

		componentWillUpdate(nextProps, nextState) {
			// ...
		}

		componentDidUpdate(prevProps, prevState) {
			// ...
		}

		render() {
			return <div>This is a demo</div>
		}

	}

	$ 注意：你不能在componentWillUpdate中执行setState.


import React, {Component} from 'react';

class CommentListContainer extends Component {
	
	constructor(props) {
		super(props);

		this.state = {
			loading: true,
			error: null,
			value: null
		}
	}

	componentDidMount() {
		this.props.promise.then((res) => {
			res.json();
		}).then((value) => {
			this.setState({loading: false, value});
		}).catch((err) => {
			this.setState({loading: false, error});
		})
	}

	render() {
		if(this.state.loading) {
			return <div>Loading</div>
		} else if(this.state.error !== null) {
			return <span>Error: {this.state.error.message}</span>
		} else {
			const list = this.state.value.commentList;

			return (
				<CommentList comments={list} />
			);	
		}
	}

}

function CommentList({comments}) {
	return (
		{comments.map((entry, i)=>{
			<li key={`response-${i}`} className="comment-item">
				<p className="comment-item-name">{entry.name}</p>
				<p className="comment-item-content">{entry.content}</p>
			</li>
		})};
	);
}

=>Flux基本概念
	
	一个Flux应用由3大部分组成--dispatcher、store和view，其中dispatcher负责分发事件；store负责保存数据，
	同时响应事件并更新数据；view负责订阅store的数据，并使用这些数据渲染相应的页面。

	
=>深入Redux应用架构
	
	>>>Redux三大原则

	1.单一数据源

	在传统的MVC架构中，我们可以根据不需要创建无数个Model，而model之间可以互相监听、触发事件甚至循环或
	嵌套触发事件，这些在Redux中的都是不允许的。

	因为在Redux的思想里，一个应用永远只有唯一的数据源。我们的第一个反应可能是：如果有一个复杂的应用，
	强制要求唯一的数据源岂不是一个特别庞大的javascript对象。

	实际上，使用单一数据源的好处在于整个应用状态都保存在一个对象中，这样我们随时可以提取整个应用的状态
	进行持久化（比如实现一个针对整个应用的即时保存功能）。此外，这样的设计也为服务器端的渲染提供了可能。

	2.状态是只读的

	这一点和flux的思想是不谋而合的，不同的是在Flux中，因为store没有setter而限制了我们直接修改应用状态
	的能力，而在Redux中，这个限制被执行得更加彻底，因为我们压根没有store。

	在Redux中，我们并不会自己用代码来定义一个store。取而代之的是，我们定义了一个reducer，它的功能是根据
	当前触发的action对当前的应用状态（state）进行迭代，这里我们并没有直接修改应用的状态，而是返回了一份
	全新的状态。

	Readux提供的createStore方法会根据reducer生成store。最后可以利用store.dispatcher方法来达到修改状态的目的。

	3.状态修改均由纯函数完成
	这是Redux与Flux在表现上的最大不同。在Flux中，我们在actionCreator是调用AppDispatcher.dispath方法来触发
	action，这样不仅有冗余的代码，而且因为直接修改了store中的数据，将导致无法保存每次数据变化前后的状态。
	
	在Redux里，我们通过定义reduce来确定状态的修改，而每一个reduce都是纯函数，这意味着它没有副作用，即接受
	一定的输入，必定会有一定的输入。

	这样设计的好处不仅在于reducer里对状态的修改变得简单、纯粹、可测试，更有意思的是，Redux利用每次新返回的
	状态生成炫酷的时间旅行（time travel）调用方法，让跟踪第一每因为触发action而改变状态的结果成为了可能。


	>>>Redux核心API--createStore
	import {createStore} from 'redux';
	const store = createStore(reducers);

	通过createStore方法创建一个store是一个对象，它本身包含4个方法：
	1.getState()：获取store中当前的状态。
	2.dispatch(action)：分发一个action，并返回这个action，这是唯一能改变store中数据的方式。
	3.subscribe(listener)：注册一个监听者，它在store发生变化时被调用。；
	4.replaceReducer(nextReducer)：更新当前store里的reducer，一般只会在开发模式中调用该方法。

	>>理解middleware机制
	import compose from 'compose';

	export default function applyMiddleware(...middlewares) {
		return (next)=> (reducer, initialState) => {
			let store = next(reduce, initialState);
			let dispatch = store.dispatch;
			let chain = [];

			let middleAPI = {
				getState: store.getState,
				dispatch: (action)=>dispatch(action)
			};
			chain = middlewares.map(middlewares => middleware(middlewareAPI));
			dispatch = compose(...chain)(store.dispatch);
		
			return {
				...store,
				dispatch
			}
		}
	}
