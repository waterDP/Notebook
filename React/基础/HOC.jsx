// todo 高阶组件
/**
 * 高阶组件（HOC）是React中用于复用组件逻辑的一种高级技巧。
 * HOC自身不是React API的一部分，它是一种基于React的组合特性而形成的设计模式
 * 具体而言，高阶组件是参数为组件，返回值为新组件的函数
 */
const EnhancedComponent = higherOrderComponent(WrappedComponent)

/** 
 * 组件是将props转换为UI，而高阶组件是将组件转换为另一个组件 
 */

// 例如，假设有一个CommentList组件，它订阅外部数据源，用来渲染评论列表
class CommentList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      // 假设"DataSource"是个全局范围内的数据源变量
      comments: DataSource.getComments()
    }
  }
  componentDidMount() {
    // 订阅更改
    DataSource.addChangeListener(this.handleChange)
  }
  componentWillUnmount() {
    // 清除订阅
    DataSource.removeChangeListener(this.handleChange)
  }
  handleChange = () => {
    // 当数据源更新时，更新组件状态
    this.setState({
      comments: DataSource.getComments()
    })
  }
  render() {
    return (
      <div>
        {this.state.comments.map((comment) => {
          <Comment comment={comment} key={comment.id} />
        })}
      </div>
    )
  }
}

// 稍后，编写了一个用于订阅单个博客帖子的组件，该帖子遵循类似的模式
class BlogPost extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      // 假设"DataSource"是个全局范围内的数据源变量
      blogPost: DataSource.getBlogPost(props.id)
    }
  }
  componentDidMount() {
    // 订阅更改
    DataSource.addChangeListener(this.handleChange)
  }
  componentWillUnmount() {
    // 清除订阅
    DataSource.removeChangeListener(this.handleChange)
  }
  handleChange = () => {
    // 当数据源更新时，更新组件状态
    this.setState({
      blogPost: DataSource.getBlogPost(this.props.id)
    })
  }
  render() {
    return <TextBlock text={this.state.blogPost} />
  }
}

/**
 * CommentList 和 BlogPost不同，但它们的大部实现都是一样的
 * 在挂载时，向DataSource添加一个更改监听器
 * 在监听器内部，当数据源发生变化时，调用setState
 * 在卸载时，删除监听器
 */
function CommentList(props) {
  return (
    props.data.map((comment) => {
      <Comment comment={comment} key={comment.id} />
    })
  )
}
const CommentListWithSubscription = withSubscription(
  CommentList,
  (DataSource) => DataSource.getComments()
)

function BlogPost(props) {
  return <TextBlock text={props.data} />
}
const BlogPostWithSubscriptions = withSubscription(
  BlogPost,
  (DataSource, props) => DataSource.getBlogPost(props.id)
)

// 第一个参数是被包装组件， 第二个参数通过DataSource和当前的Props返回我们需要的数据
/** 
 * @param {Component} WrappedComponent 
 * @param {function} selectData
 * @return {Component}
 */
function withSubscription(WrappedComponent, selectData) {
  return class extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        data: selectData(DataSource, props)
      }
    }
    componentWilDidMount() {
      // 负责订阅相关的操作
      DataSource.addChangeListener(this.handleChange)
    }
    componentWillUnmount() {
      DataSource.removeChangeListener(this.handleChange)
    }
    handleChange = () => {
      this.setState({
        data: selectData(DataSource, this.props)
      })
    }
    render() {
      // ... 并使用新数据渲染被包装的组件
      // 请注意，我们可能还会传递其它属性
      return <WrappedComponent data={this.state.data} {...this.props} />
    }
  }
}

import hoistNonReactStatic from "hoist-non-react-statics"
// 自动拷贝所有非React静态方法 
function enhance(WrappedComponent) {
  class Enhance extends React.Component {/* ... */ }
  hoistNonReactStatic(Enhance, WrappedComponent);
  return Enhance;
}

/* 
  请注意，HOC 不会修改传入的组件，也不会使用继承来复制其行为。
  相反，HOC 通过将组件包装在容器组件中来组成新组件。HOC 是纯函数，没有副作用。
*/

// ! 不要改变原始组件，使用组合
// HOC不应该修改传入的组件，而应该使用组合的方法，通过将组件包装在容器组件中实现功能
function logProps(WrappedComponent) {
  return class extends React.Component {
    componentDidUpdate(prevProps) {
      console.log('Current props', this.props)
      console.log('Previous Props', prevProps)
    }
    render() {
      return <WrappedComponent {...this.props} />
    }
  }
}

// ! 约定：将不相关的props传递给被包裹的组件
/* 
  HOC为组件添加特性。自身不应该大幅改变约定。HOC返回的组件与原始组件应该保持类似的接口
  HOC应该透传与自身无关的props。大多数HOC都应该包含一个类似于下面的render方法
*/
function hocTmp(WrappedComponent) {
  return class extends React.Component {
    render() {
      // 过滤掉非此HOC额外的props,且不要进行透传
      const { extraProps, ...passThroughProps } = this.props

      // 将props注入到被包装的组件中
      // 通常为state的值或者实例方法
      const injectedProps = someStateOrInstanceMethod

      // 将props传递给被包裹的组件
      return (
        <WrappedComponent
          injectedProps={injectedProps}
          {...passThroughProps}
        />
      )
    }
  }
}

// ! 约定：最大化可组合性
// 并不是所有的HOC都一样。有时候它仅接受一个参数，也就是被包裹的组件：
const NavbarWithRouter = withRouter(Navbar)

// HOC通常可以接收多个参数。比如Relay中，HOC额外接收了一个配置对象用于指定组件的数据依赖：
const CommentWithRelay = Relay.createContainer(Comment, config)

// 最常见的HOC签名如下
const ConnectedComment = connect(commentSelector, commentActions)(CommentList)

// ! 注意事项
// 1. 不要在render方法中使用HOC
// 2. 务必复制静态方法
function enhance(WrappedComponent) {
  class Enhance extends React.Component {/*  */ }
  // 必须准确知道拷贝哪些方法
  Enhance.staticMethod = WrappedComponent.staticMethod
  return
}

// 但要这样做，你需要知道哪些方法应该被拷贝。你可以使用hoist-non-react-statics自动拷贝所有非React静态方法
import hoistNonReactStatic from 'hoist-non-react-statics'
function enhance(WrappedComponent) {
  class Enhance extends React.Component {/*  */ }
  hoistNonReactStatic(Enhance, WrappedComponent)
  return Enhance
}

// 除了导出组件，另一个可行的方法是再额外导出这个静态方法
MyComponent.someFunction = someFunction
export default MyComponent

// ...单独导出该方法...
export { someFunction }

// ...并在要使用的组件中，import它们
import MyComponent, { someFunction } from './MyComponent.js'



// ! 二、强化props
// 1.混入props
function funHoc(WrapComponent) {
  return function Index(props) {
    const [state, setState] = useState({ name: 'alien' })
    return <WrapComponent {...props} {...state} />
  }
}

// 2抽离state控制更新
function classHoc(WrapComponent) {
  return class Index extends React.Component {
    constructor() {
      super()
      this.state = {
        name: 'alien'
      }
    }
    changeName(name) {
      this.setState({ name })
    }
    render() {
      return <WrapComponent {...this.props} {...this.state} changeName={this.changeName.bind(this)} />
    }
  }
}
function Index(props) {
  const [value, setValue] = useState(null)
  const { name, changeName } = props
  return (
    <div>
      <div>hello world, my name is {name}</div>
      <input onChange={e => setValue(e.target.value)} />
      <button onClick={() => changeName(value)}>确定</button>
    </div>
  )
}

// ! 二、控制渲染

// 基础：动态渲染
// 实现一个动态挂载的HOC
function renderHOC(WrapComponent) {
  return class Index extends React.Component {
    constructor(props) {
      super(props)
      this.state = { visible: true }
    }
    setVisible() {
      this.setState({ visible: !this.state.visible })
    }
    render() {
      return (
        <div className='box'>
          <button onClick={this.setVisible.bind(this)}>挂载组件</button>
          {
            visible
              ? <WrapComponent {...this.props} setVisible={this.setVisible.bind(this)}></WrapComponent>
              : (
                <div className="icon">
                  <SyncOutlined spin className="theicon"></SyncOutlined>
                </div>
              )
          }
        </div>
      )
    }
  }
}

class Index extends React.Component {
  render() {
    const { setVisible } = this.props
    return (
      <div className="box">
        <p>Hello, my name is alien</p>
        <img src="someUrl" />
        <button onClick={() => setVisible()}>卸载当前组件</button>
      </div>
    )
  }
}
export default renderHOC(Index)

// 分片渲染
const renderQueue = []
const isFirstRender = false

const tryRender = () => {
  const render = renderQueue.shift()
  if (!render) return
  setTimeout(() => {
    render()
  }, 300)
}

function renderHOC(WrapComponent) {
  return function Index(props) {
    const [isRender, setRender] = useState()
    useEffect(() => {
      renderQueue.push(() => {
        setRender(true)
      })
      if (!isFirstRender) {
        tryRender()
        isFirstRender = true
      }
    }, [])

    return (
      isRender
        ? <WrapComponent tryRender={tryRender} {...props} />
        : (
          <div className='box' >
            <div className="icon" >
              <SyncOutlined spin />
            </div>
          </div>
        )
    )
  }
}

class Index extends React.Component {
  componentDidMount() {
    const { name, tryRender } = this.props
    /* 上一部分渲染完毕，进行下一次渲染 */
    tryRender()
  }
  render() {
    return (
      <div>
        <img src="url" alt="" />
      </div>
    )
  }
}

const Item = renderHOC(index)

export default () => {
  return (
    <>
      <Item name='组件一'></Item>
      <Item name='组件二'></Item>
      <Item name='组件三'></Item>
    </>
  )
}

// todo 反向继承：渲染劫持
// HOC反向继承模式，可以实现颗粒化的渲染劫持，也就是可以控制基类组件的render函数，还可以篡改props，或者是children
const HOC = WrapComponent => {
  return class Index extends WrapComponent {
    render() {
      if (this.props.visible) {
        return super.render()
      } else {
        return <div>数据暂无</div>
      }
    }
  }
}

// todo 反向继承：修改渲染树
class Index extends React.Component {
  render() {
    return (
      <div>
        <ul>
          <li>react</li>
          <li>vue</li>
          <li>angular</li>
        </ul>
      </div>
    )
  }
}

function HOC(WrapComponent) {
  return class Advance extends WrapComponent {
    render() {
      const element = super.render()
      const otherProps = {
        name: 'alien'
      }
      // 替换Angular节点
      const appendElement = React.createElement('li', {}, `hello world, myName is ${otherProps.name}`)
      const newChildren = React.children.map(element.props.children.props.children, (child, index) => {
        if (index === 2) return appendElement
        return child
      })
      return React.cloneElement(element, element.props, newChildren)
    }
  }
}
export default HOC(Index)

// todo 节流渲染
function HOC(Component) {
  return function renderWrapComponent(props) {
    const { num } = props
    const RenderElement = useMemo(() => <Component {...props} />, [num])
    return RenderElement
  }
}

class Index extends React.Component {
  render() {
    return <div>hello world</div>
  }
}
const IndexHoc = HOC(Index)

export default () => {
  const [num, setNumber] = useState(0)
  const [num1, setNumber1] = useState(0)
  const [num2, setNumber2] = useState(0)

  return (
    <div>
      <IndexHoc num={num} num1={num1} num2={num2} />
      <button onClick={() => setNumber(num + 1)} >num++</button>
      <button onClick={() => setNumber1(num1 + 1)} >num1++</button>
      <button onClick={() => setNumber2(num2 + 1)} >num2++</button>
    </div>
  )
}

// todo 定制化渲染流
function HOC(rule) {
  return function (Component) {
    return function renderWrapComponent(props) {
      const dep = rule(props)
      const RenderElement = useMemo(() => <Component {...props} />, [dep])
      return RenderElement
    }
  }
}

/* 只有props中num变化，渲染组件 */
@HOC((props) => props['num'])
class IndexHoc extends React.Component {
  render() {
    return <div>组件一</div>
  }
}

/* 只有props中num1变化，渲染组件 */
@HOC((props) => props['num1'])
class IndexHoc1 extends React.Component {
  render() {
    return <div>组件二</div>
  }
}

export default () => {
  const [num, setNumber] = useState(0)
  const [num1, setNumber1] = useState(0)
  const [num2, setNumber2] = useState(0)
  return <div>
    <IndexHoc num={num} num1={num1} num2={num2} />
    <IndexHoc1 num={num} num1={num1} num2={num2} />
    <button onClick={() => setNumber(num + 1)} >num++</button>
    <button onClick={() => setNumber1(num1 + 1)} >num1++</button>
    <button onClick={() => setNumber2(num2 + 1)} >num2++</button>
  </div>
}

// ! 三、赋能组件
// 属性代理实现
function HOC(Component) {
  const proDidMount = Component.prototype.componentDidMount
  Component.prototype.componentDidMount = function() {
    // ! AOP
    console.log('劫持生命周期：componentDidMount')
    proDidMount.call(this)
  }
  return class WrapComponent extends React.Component {
    render() {
      return <Component {...this.props} />
    }
  }
}

@HOC
class Index extends React.Component {
  componentDidMount() {
    console.log('==didMounted==')
  }
  render() {
    return <div>hello, world</div>
  }
}

// 反向继承实现
function HOC(Component) {
  const didMount = Component.prototype.componentDidMount
  return class wrapComponent extends Component {
    componentDidMount() {
      // 支持生命周期
      if (didMount) {
        didMount.apply(this)
      }
    }
    render() {
      return super.render()
    }
  }
}

@HOC
class Index extends React.Component {
  componentDidMount() {

  }
  render() {
    return <div>hello world</div>
  }
}


/* 事件监控 */
// ! 1、组件内的事件监控
function ClickHOC(Component) {
  return function Wrap(props) {
    const dom = useRef(null)
    useEffect(() => {
      const handleClick = () => {console.log('发生的点击事件')}
      dom.current.addEventListener('click', handleClick)
      return () => dom.current.removeEventListener('click', handleClick)
    }, [])
    return <div ref={dom}><Component {...props} /></div>
  }
}

@ClickHOC
class Index extends React.Component {
  render() {
    return <div className="index">
      <p>hello world</p>
      <button>组件内部点击</button>
    </div>
  }
}

/**
 * todo ref 助力操控组件实例
 * 对于属性代理我们虽然不能直接获取组件内部的状态，但是我们可以通过ref获取组件实例，获取到组件实例，就可以获取组件的一些状态
 * 或者手动触发一些事件，进一步强化组件，但是注意的是：
 * class声明的有状态组件才有实例，function声明的无状态组件不存在实例
 */
// 属性代理-添加额外生命周期
function HOC(Component) {
  return class WrapComponent extends React.Component {
    constructor() {
      super()
      this.node = null
    }
    UNSAFE_componentWillReceiveProps(nextprops) {
      if (nextprops.number !== this.props.number) {
        this.node.handlerNumberChange  &&  this.node.handlerNumberChange.call(this.node)
      }
    }
    render() {
      return <Component {...this.props} ref={node => this.node = node} />
    }
  }
}

@HOC
class Index extends React.Component {
  handlerNumberChange() {
    /*  监听number的改变 */
  }
  return() {
    return <div>hello world</div>
  }
}