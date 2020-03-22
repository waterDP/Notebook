class Transaction {
  constructor(wrappers) {
    this.wrappers = wrappers;//{initialize,close}
  }
  perform(anyMethod) {
    this.wrappers.forEach(wrapper => wrapper.initialize());
    anyMethod.call();
    this.wrappers.forEach(wrapper => wrapper.close());
  }
}
//batchingStrategy.isBatchingUpdates batchedUpdates
let batchingStrategy = {
  isBatchingUpdates: false,//默认是非批量更新模式
  dirtyComponents: [],// 脏组件 就组件的状态和界面上显示的不一样
  batchedUpdates() {
    this.dirtyComponents.forEach(component => component.updateComponent());
  }
}
class Updater {
  constructor(component) {
    this.component = component;
    this.pendingStates = [];
  }
  addState(partcialState) {
    this.pendingStates.push(partcialState);
    batchingStrategy.isBatchingUpdates
      ? batchingStrategy.dirtyComponents.push(this.component)
      : this.component.updateComponent()
  }
}
class Component {
  constructor(props) {
    this.props = props;
    this.$updater = new Updater(this);
  }
  setState(partcialState) {
    this.$updater.addState(partcialState);
  }
  updateComponent() {
    this.$updater.pendingStates.forEach(partcialState => Object.assign(this.state, partcialState));
    this.$updater.pendingStates.length = 0;
    let oldElement = this.domElement;
    let newElement = this.createDOMFromDOMString();
    oldElement.parentElement.replaceChild(newElement, oldElement);
  }
  //把一个DOM模板字符串转成真实的DOM元素
  createDOMFromDOMString() {
    //this;
    let htmlString = this.render();
    let div = document.createElement('div');
    div.innerHTML = htmlString;
    this.domElement = div.children[0];
    //让这个BUTTONDOM节点的component属性等于当前Counter组建的实例
    this.domElement.component = this;
    //this.domElement.addEventListener('click',this.add.bind(this));
    return this.domElement;
  }
  mount(container) {
    container.appendChild(this.createDOMFromDOMString());
  }
}
let transaction = new Transaction([
  {
    initialize() {
      batchingStrategy.isBatchingUpdates = true;//开始批量更新模式
    },
    close() {
      batchingStrategy.isBatchingUpdates = false;
      batchingStrategy.batchedUpdates();//进行批量更新，把所有的脏组件根据自己的状态和属性重新渲染
    }
  }
]);
window.trigger = function (event, method) {
  let component = event.target.component;//event.target=this.domElement
  transaction.perform(component[method].bind(component));
}
class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = { number: 0 }
  }

  add() {
    this.setState({ number: this.state.number + 1 });
    console.log(this.state);//0
    this.setState({ number: this.state.number + 1 });
    console.log(this.state);//0
    setTimeout(() => {
      this.setState({ number: this.state.number + 1 });
      console.log(this.state);//2
      this.setState({ number: this.state.number + 1 });
      console.log(this.state);//3
    }, 1000);
  }
  render() {
    return `
      <button onclick="trigger(event,'add')">
        ${this.props.name}:${this.state.number}
      </button>
    `
  }
}