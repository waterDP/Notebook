export async function waitFor (cb: CallableFunction): Promise<any> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(cb())
    }, 0)
  })
}
