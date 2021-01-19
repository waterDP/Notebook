// 通用的compose
// const compose = (...fns) => fns.reduce((pre, curr) => (...args) => pre(cur(...args)))

function compose(...fns) {
  return fns.reduce(function(pre, curr) {
    return function(...args) {
      return pre(curr(...args))
    }
  })
}

let toUpperCase = function(x) {
  return x.toUpperCase()
}

let exclaim = function(x) {
  return x + "!"
}

const shout = compose(console.log, exclaim, toUpperCase)

shout('send in ths clowns')
