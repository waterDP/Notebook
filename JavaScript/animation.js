function animation(duration, from, to) {
  let value = from
  const speed = (to - from) / duration
  const start = Date.now()
  function _run() {
    const t = Date.now() - start
    if (t > duration) {
      value = to
      console.log(value)
      return
    }
    value = from + speed * t
    console.log(value)
    requestAnimationFrame(_run)
  }

  _run()
}