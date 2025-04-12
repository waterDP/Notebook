

export function render() {
  document.querySelector('#app').innerHTML = `
    <h1></h1>
    <a href="http://www.baidu.com" />
  `
}

render()

if (import.meta.hot) {
  import.meta.hot.accept((newModule) => {
    newModule.render()
  })
}