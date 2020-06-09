import {
    $mobx,
    IReactionDisposer,
    Lambda,
    autorun,
    createAction,
    getNextId,
    die
} from "../internal"

export interface IWhenOptions {
    name?: string
    timeout?: number
    /**
     * Experimental.
     * Warns if the view doesn't track observables
     */
    requiresObservable?: boolean
    onError?: (error: any) => void
}

export function when(
    predicate: () => boolean,
    opts?: IWhenOptions
): Promise<void> & { cancel(): void }
export function when(
    predicate: () => boolean,
    effect: Lambda,
    opts?: IWhenOptions
): IReactionDisposer
export function when(predicate: any, arg1?: any, arg2?: any): any {
    // TODO: arglen and isObject utility?
    if (arguments.length === 1 || (arg1 && typeof arg1 === "object"))
        return whenPromise(predicate, arg1)
    return _when(predicate, arg1, arg2 || {})
}

function _when(predicate: () => boolean, effect: Lambda, opts: IWhenOptions): IReactionDisposer {
    let timeoutHandle: any
    if (typeof opts.timeout === "number") {
        timeoutHandle = setTimeout(() => {
            if (!disposer[$mobx].isDisposed_) {
                disposer()
                const error = new Error("WHEN_TIMEOUT")
                if (opts.onError) opts.onError(error)
                else throw error
            }
        }, opts.timeout)
    }

    opts.name = opts.name || "When@" + getNextId()
    const effectAction = createAction(opts.name + "-effect", effect as Function)
    // eslint-disable-next-line
    var disposer = autorun(r => {
        if (predicate()) {
            r.dispose()
            if (timeoutHandle) clearTimeout(timeoutHandle)
            effectAction()
        }
    }, opts)
    return disposer
}

function whenPromise(
    predicate: () => boolean,
    opts?: IWhenOptions
): Promise<void> & { cancel(): void } {
    if (__DEV__ && opts && opts.onError)
        return die(`the options 'onError' and 'promise' cannot be combined`)
    let cancel
    const res = new Promise((resolve, reject) => {
        let disposer = _when(predicate, resolve, { ...opts, onError: reject })
        cancel = () => {
            disposer()
            reject("WHEN_CANCELLED")
        }
    })
    ;(res as any).cancel = cancel
    return res as any
}
