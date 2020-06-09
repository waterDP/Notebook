import {
    IArrayWillChange,
    IArrayWillSplice,
    IInterceptor,
    IMapWillChange,
    IObjectWillChange,
    IObservableArray,
    IObservableValue,
    IValueWillChange,
    Lambda,
    ObservableMap,
    getAdministration,
    ObservableSet,
    ISetWillChange,
    isFunction
} from "../internal"

export function intercept<T>(
    value: IObservableValue<T>,
    handler: IInterceptor<IValueWillChange<T>>
): Lambda
export function intercept<T>(
    observableArray: IObservableArray<T>,
    handler: IInterceptor<IArrayWillChange<T> | IArrayWillSplice<T>>
): Lambda
export function intercept<K, V>(
    observableMap: ObservableMap<K, V>,
    handler: IInterceptor<IMapWillChange<K, V>>
): Lambda
export function intercept<V>(
    observableMap: ObservableSet<V>,
    handler: IInterceptor<ISetWillChange<V>>
): Lambda
export function intercept<K, V>(
    observableMap: ObservableMap<K, V>,
    property: K,
    handler: IInterceptor<IValueWillChange<V>>
): Lambda
export function intercept(object: Object, handler: IInterceptor<IObjectWillChange>): Lambda
export function intercept<T extends Object, K extends keyof T>(
    object: T,
    property: K,
    handler: IInterceptor<IValueWillChange<any>>
): Lambda
export function intercept(thing, propOrHandler?, handler?): Lambda {
    if (isFunction(handler)) return interceptProperty(thing, propOrHandler, handler)
    else return interceptInterceptable(thing, propOrHandler)
}

function interceptInterceptable(thing, handler) {
    return getAdministration(thing).intercept(handler)
}

function interceptProperty(thing, property, handler) {
    return getAdministration(thing, property).intercept(handler)
}
