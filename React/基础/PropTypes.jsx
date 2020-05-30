import PropTypes from "prop-types"

class Greeting extends React.Component {
  render() {
    return (
      <h1>Hello, {this.props.name}</h1>
    )
  }
  static propTypes = {
    name: PropTypes.string
  }
  static defaultProps = {
    name: 'mode'
  }
}

// todo 以下提供了使用不同验证器的例子
import PropTypes from "prop-types"

MyComponent.propTypes = {
  // 你可以将属性声明为js原生类型，默认情况下，这些属性是可选的
  optionalArray: PropTypes.array,
  optionalBool: PropTypes.bool,
  optionalFunc: PropTypes.func,
  optionalNumber: PropTypes.number,
  optionalObject: PropTypes.object,
  optionalString: PropTypes.string,
  optionalSymbol: PropTypes.symbol,
  
  // 任何可被渲染的元素（包括数字，字符串，元素或数组）
  // (或 Fragment) 也包含这些类型
  optionalNode: PropTypes.node,

  // 一个React元素
  optionalElement: PropTypes.element,

  // 一个React元素类型（即，MyComponent）
  optionalElementType: PropTypes.elementType,

  // 你也可以声明prop为类的实例，这里使用js的instanceof操作符
  optionalMessage: PropTypes.instanceOf(Message),

  // 你可以让你的prop只能是特定的值，指定它为枚举类型
  optionalEnum: PropTypes.oneOf(['News', 'Photos']),

  // 一个对象可以是几种类中的任意一个类型
  optionalUnion: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.instanceOf(Message)
  ]),

  // 可以指定一个数组由某一类型的元素组成
  optionalArrayOf: PropTypes.arrayOf(PropTypes.number),

  // 可以指定一个对象由某一类型的值组成
  optionalObjectOf: PropTypes.objectOf(PropTypes.number),

  // 可以指定一个对象由特定的类型值组成
  optionalObjectWithShape: PropTypes.shape({
    color: PropTypes.string,
    quantity: PropTypes.number
  }),

  // 你可以在任何PropTypes属性后面加上'isRequired',无保这个prop没有被提供时，会打印警告信息
  requiredFunc: PropTypes.func.isRequired,

  // 任意类型的数据
  requireAny: PropTypes.any.isRequired,

  // 你可以指定一个自定义验证器。它在验证失败时应返回一个Error对象
  // 请不要使用 `console.warn`或抛出异常，因为在`oneOfType`中不会起作用
  customProp: function(props, propName, componentName) {
    if (!/matchme/.test(props[propName])) {
      return new Error(`Invalid prop ${propName} supplied to ${componentName}. Validation failed`)
    }
  }
}

// todo 默认Prop值
/* 你可以通过配置特定的defaultProps属性来定义props的默认值 */
class Greetings extends React.Component {
  render() {
    return (
      <h1>Hello, {this.props.name}</h1>
    )
  }
  static defaultProps = {
    name: 'Stranger'
  }
}