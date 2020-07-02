/* 
  Vuex的Store接受plugins选项，这个选项暴露出每次mutation的钩子。Vuex插件就是一个函数，它接收一个store作为唯一的参数
*/
const myPlugins = store => {
  // 当store初始化后调用
  store.subscribe((mutation, store) => {
    // 每次 mutation之后调用 
    // mutation的格式为｛type, payload｝
  })
}

// 然后像这样使用
const store = new Vuex.Store({
  plugins: [
    myPlugins
  ]
})

/**
 * todo 在插件内提交Mutation
 * 在插件中不允许直接修改状态——类似于组件，只能通过提交mutation来触发变化
 * 通过提交mutation, 插件可以用来同步数据源到store。例如，同步websocket数据源到store
 */
export default function createWebSocketPlugin(socket) {
  return store => {
    socket.on('data', data => {
      store.commit('receiveData', data)
    })
    socket.subscribe(mutation => {
      if (mutation.type === 'UPDATE_DATA') {
        socket.emit('update', mutation.payload)
      }
    })
  }
}

const plugin = createWebSocketPlugin(socket)

const store = new Vuex.Store({
  state,
  mutations,
  plugins: [
    plugin
  ]
})

/**
 * todo 生成state快照
 * 有时候插件需要获得状态的‘快照’，比较改变的前后状态。想要实现这项功能，你需要对对象进行深拷贝
 */
const myPluginWithSnaptshot = store => {
  let preState = _.cloneDeep(store.state)
  store.subscribe((mutation, state) => {
    let nextState = _.cloneDeep(state)
    // 比较prevState和nextState...
    // 保存状态，用于下一次mutations
    preState = nextState
  })
}

// 生成状态快照应该只有开发阶段使用，
const store = new Vuex.Store({
  plugins: Process.env.NODE_ENV !== 'production' ?
    [myPluginWithSnaptshot]: []
})

// todo 内置Logger插件
import createLogger from "vuex/dist/logger"
const store = new Vuex.Store({
  plugins: [createLogger()]
})

// createLogger函数有几个配置项
const logger = createLogger({
  collapsed: false, // 自动展开记录的mutation
  filter(mutations, stateBefore, stateAfter) {
    // 若mutation需要被记录，就让它返回true即可
    // 顺便， mutation是个｛type, payload｝对象 
    return mutation.type !== 'aBlacklistedMutation'
  },
  transformer(state) {
    // 在开启记录之前转换状态
    // 例如，只返回指定的子树
  },
  mutationsTransformer(mutation) {
    // mutation按照{type, payload} 格式记录
    // 我们可以按任意方式格式化
    return mutation.type
  },
  logger: console // 
})