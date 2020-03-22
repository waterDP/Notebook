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