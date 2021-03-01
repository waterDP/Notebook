/**
 * todo: v-model
 * v-model是Vue提供的一个语法糖，它本质上是由 value属性（默认） + input事件(默认)组成的, 
 * 所以，在JSX中，我们便可以回归本质，通过传递value属性并监听input事件来实现数据的双向绑定。
 */
export default {
  data() {
    return {
      name: ''
    }
  },
  methods: {
    // 监听 onInput 事件进行赋值操作
    $_handleInput(e) {
      this.name = e.target.value
    }
  },
  render() {
    // 传递 value 属性 并监听 onInput事件
    return <input value={this.name} onInput={this.$_handleInput}></input>
  }
}

/**
 * todo: v-if 与 v-for
 * 在模板代码里面我们通过v-for去遍历元素，通过v-if去判断是否渲染元素
 * 在jsx中，对于v-for可以使用for循环,array.map来代替，对于v-if，可以使用if语句，三元表达式来代替
 */
// 循环遍历列表
export default {
  render() {
    const list = ['java', 'c++', 'javascript', 'c#', 'php']
    return (
      <ul>
        {list.map(item => {
          return <li>item</li>
        })}
      </ul>
    )
  }
}
// 使用判断条件
export default {
  render() {
    const isGirl = true
    return isGirl ? <div>小妹，哥哥教你写vue</div> : <div>你干啥呢？</div>
  }
}

// todo v-bind
export default {
  render() {
    return <input value={this.name}></input>
  }
}

/**
 * todo v-html 与 v-text
 * vue中的属性分成三大类
 * 1.最常用的是props，即组件自定义属性
 * 2.attrs 指在父作用域内传入，但未在子组件内定义的属性
 * 3.domProps: 包括了innerHTML/textContent/value
 */
export default {
  data() {
    return {
      content: '<div>这是一段文字</div>'
    }
  },
  render() {
    return (
      <>
        {/* v-html指令在jsx的写法里是domPropsInnerHTML */}
        <div domPropsInnerHTML={this.content}></div>
        {/* v-content */}
        <div>{this.content}</div>
      </>
    )
  }
}

/**
 * todo 监听事件与原生事件
 * 当我们开发一个组件之后，一般会通过this.$emit('change')的方式对外暴露事件，
 * 然后通过v-on:change的方法去监听事件。
 * 很遗憾,在JSX中你无法使用v-on指令，但你将锁定一个新姿势
 */
export default {
  render() {
    return <CustomSelect onChange={this.$_handleChange}></CustomSelect>
  }
}
// 监听原生事件
export default {
  render() {
    return <CustomSelect nativeOnClick={this.$_handleChange}></CustomSelect>
  }
}

// ! 使用对象方式去监听
export default {
  render() {
    return (
      <ElInput
        value={this.content}
        on={{
          focus: this.$_handleFocus,
          input: this.$_handleInput
        }}
        nativeOn={{
          click: this.$_handleClick
        }}
      ></ElInput>
    )
  }
}

/**
 * todo 自定义默认插槽
 * 在Vue的实例this上面有一个属性$slots,这个上面就挂载了这个组件内部所使用的所有插槽
 * 使用this.$slots.default就可以将默认插槽加入到组件内部
 */
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  render() {
    return (
      <div class="custom-dialog" vShow={this.visible}>
        {this.$slots.default}
      </div>
    )
  }
}

// todo 自定义具名插槽
export default {
  render() {
    return (
      <div class="custom-dialog" vShow={this.visible}>
        <div class="custom-dialog__footer">{this.$slots.footer}</div>
      </div>
    )
  }
}

// todo 自定义作用域插槽
export default {
  render() {
    const {data} = this
    // 获取副标题作用域插槽
    const titleSlot = this.$scopedSlots.title
    return (
      <div class="item">
        {/* 如果有标题插槽，则使用标题插槽，否则使用默认插槽 */}
        {titleSlot ? titleSlot(data) : <span>{data.title}</span>}
      </div>
    )
  }
}