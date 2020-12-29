// 通用的compose
// const compose = (...fns) => fns.reduce((f, g) => (...args) => f(g(...args)))

function compose(...fns) {
  return fns.reduce(function(f, g) {
    return function(...args) {
      return f(g(...args))
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
