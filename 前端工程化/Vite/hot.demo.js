

let timer
let index = import.meta.hot.data?.cache?.getIndex?.() || 0

export function render() {
  timer = setInterval(() => {
    document.querySelector('#app').innerHTML = `
      <h1>${index}</h1>
      <a href="http://www.baidu.com" />
    `
  })
}

render()

if (import.meta.hot) {
  import.meta.hot.data.cache = {
    getIndex() {
      return index
    }
  }
  import.meta.hot.dispose(() => {
    if (timer) {
      clearInterval(timer)
    }
  })
}