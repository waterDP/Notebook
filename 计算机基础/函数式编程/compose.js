// 通用的compose
const compose = (...fns) => fns.reduce((pre, curr) => (...args) => pre(curr(...args)))

function compose(...fns) {
  return fns.reduce((pre, cur) => {
    return (...args) => {
      return pre(cur(...args))
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


function composePromise(...fns) {
  const init = fns.pop()
  return function(...args) {
    return fns.reverse().reduce((pre, cur) => {
      return pre.then(result => {
        return cur.call(null, result)
      })
    }, Promise.resolve(init.apply(null, args)))
  }
}