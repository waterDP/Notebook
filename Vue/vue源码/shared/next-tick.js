let callbacks = []
let pending = false

function flushCallbacks() {
  callbacks.forEach(cb => cb())
  pending = false
  callbacks = []
}

let timerFunc

if (Promise) {
  timerFunc = () => {
    Promise.resolve().then(flushCallbacks)
  }
} else if (MutationObserver) {
  let observer = new MutationObserver(flushCallbacks)
  let textNode = document.createTextNode(1)
  observer.observe(textNode, {
    characterData: true
  })
  timerFunc = () => {
    textNode.textContext = 2
  }
} else if (setImmediate) {
  timerFunc = () => {
    setImmediate(flushCallbacks)
  }
} else {
  timerFunc = () => {
    setTimeout(flushCallback)
  }
}

export function nextTick(cb) {
  callbacks.push(cb)
  if(!pending) {
    pending = true
    timerFunc()
  } 
}