let callbacks = []
let waiting = false

function flushCallback() {
  callbacks.forEach(cb => cb())
  waiting = false
  callbacks = []
}

export function nextTick(cb) {
  callbacks.push(cb)

  if (!waiting) {
    setTimeout(flushCallback)
    waiting = true
  }
}