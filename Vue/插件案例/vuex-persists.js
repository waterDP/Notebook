function persists(store) {
  let local = localStorage.getItem('VUEX:state')
  if (local) {
    store.replace(JSON.parse(local))  // 会用local替换掉所有的状态 
  }
  store.subscribe((mutations, state) => {
    // 这里需要做一个节流
    localStorage.setItem('VUEX:state', JSON.stringify(state))
  })
}