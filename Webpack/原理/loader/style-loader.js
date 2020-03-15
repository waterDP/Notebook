function leader(source) {
  let style = `
    let style = document.createElement('style')
    style.innerHTML = ${JSON.stringify(source)}
    document.head.appendChild(style)
  `
  return style
}
module.exports = loader;