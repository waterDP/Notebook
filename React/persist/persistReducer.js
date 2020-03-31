export default function (persistConfig, reducers) {
    let isInited = false;
    return (state, action) => {
        switch (action.type) {
            case 'PERSIST_INIT':
                isInited = true;
                let value = persistConfig.storage.getItem('persist:'+ persistConfig.key);
                state = value ? JSON.parse(value) : undefined;
                return reducers(state, action)
            default:
                if (isInited) {
                    state = reducers(state, action);
                    persistConfig.storage.setItem('persist:'+ persistConfig.key, JSON.stringify(state));
                    return state;
                }
                return reducers(state, action);
        }
       
    }
}