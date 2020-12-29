const PERSIST_INIT = 'PERSIST_INIT'
export default function persistStore(store) {
  let persister = {
    ...store,
    initState() {
      store.dispatch({ type: PERSIST_INIT })
    }
  }
  return persister
}