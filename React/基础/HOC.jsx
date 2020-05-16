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
    componentWilDidMount(){
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
  class Enhance extends React.Component{/* ... */}
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
      const {extraProps, ...passThroughProps} = this.props

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
  class Enhance extends React.Component {/*  */}
  // 必须准确知道拷贝哪些方法
  Enhance.staticMethod = WrappedComponent.staticMethod
  return 
}

// 但要这样做，你需要知道哪些方法应该被拷贝。你可以使用hoist-non-react-statics自动拷贝所有非React静态方法
import hoistNonReactStatic from 'hoist-non-react-statics'
function enhance(WrappedComponent) {
  class Enhance extends React.Component {/*  */}
  hoistNonReactStatic(Enhance, WrappedComponent)
  return Enhance
}

// 除了导出组件，另一个可行的方法是再额外导出这个静态方法
MyComponent.someFunction = someFunction
export default MyComponent

// ...单独导出该方法...
export {someFunction}

// ...并在要使用的组件中，import它们
import MyComponent, {someFunction} from './MyComponent.js'