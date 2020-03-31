const PERSIST_INIT = 'PERSIST_INIT';
export default function persistStore(store){
    let persistor = {
        ...store,
        initState(){
            store.dispatch({type:PERSIST_INIT});
        }
    }
    return persistor;
}