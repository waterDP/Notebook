import {
    $mobx,
    Atom,
    EMPTY_ARRAY,
    IAtom,
    IEnhancer,
    IInterceptable,
    IInterceptor,
    IListenable,
    Lambda,
    addHiddenFinalProp,
    checkIfStateModificationsAreAllowed,
    createInstanceofPredicate,
    getNextId,
    hasInterceptors,
    hasListeners,
    interceptChange,
    isObject,
    isSpyEnabled,
    notifyListeners,
    registerInterceptor,
    registerListener,
    spyReportEnd,
    spyReportStart,
    allowStateChangesStart,
    allowStateChangesEnd,
    assertProxies,
    reserveArrayBuffer,
    hasProp,
    die
} from "../internal"

const SPLICE = "splice"
export const UPDATE = "update"
export const MAX_SPLICE_SIZE = 10000 // See e.g. https://github.com/mobxjs/mobx/issues/859

export interface IObservableArray<T = any> extends Array<T> {
    spliceWithArray(index: number, deleteCount?: number, newItems?: T[]): T[]
    observe(
        listener: (changeData: IArrayChange<T> | IArraySplice<T>) => void,
        fireImmediately?: boolean
    ): Lambda
    intercept(handler: IInterceptor<IArrayWillChange<T> | IArrayWillSplice<T>>): Lambda
    clear(): T[]
    replace(newItems: T[]): T[]
    remove(value: T): boolean
    toJS(): T[]
    toJSON(): T[]
}

export interface IArrayChange<T = any> {
    type: "update"
    object: IObservableArray<T>
    index: number
    newValue: T
    oldValue: T
}

export interface IArraySplice<T = any> {
    type: "splice"
    object: IObservableArray<T>
    index: number
    added: T[]
    addedCount: number
    removed: T[]
    removedCount: number
}

export interface IArrayWillChange<T = any> {
    type: "update"
    object: IObservableArray<T>
    index: number
    newValue: T
}

export interface IArrayWillSplice<T = any> {
    type: "splice"
    object: IObservableArray<T>
    index: number
    added: T[]
    removedCount: number
}

const arrayTraps = {
    get(target, name) {
        if (name === $mobx) return target[$mobx]
        if (name === "length") return target[$mobx].getArrayLength_()
        if (typeof name === "number") {
            return arrayExtensions.get.call(target, name)
        }
        if (typeof name === "string" && !isNaN(name as any)) {
            return arrayExtensions.get.call(target, parseInt(name))
        }
        if (hasProp(arrayExtensions, name)) {
            return arrayExtensions[name]
        }
        return target[name]
    },
    set(target, name, value): boolean {
        if (name === "length") {
            target[$mobx].setArrayLength_(value)
        }
        if (typeof name === "number") {
            arrayExtensions.set.call(target, name, value)
        }
        if (typeof name === "symbol" || isNaN(name)) {
            target[name] = value
        } else {
            // numeric string
            arrayExtensions.set.call(target, parseInt(name), value)
        }
        return true
    },
    preventExtensions() {
        die(15)
    }
}

export class ObservableArrayAdministration
    implements IInterceptable<IArrayWillChange<any> | IArrayWillSplice<any>>, IListenable {
    atom_: IAtom
    values_: any[] = []
    interceptors
    changeListeners
    enhancer_: (newV: any, oldV: any | undefined) => any
    dehancer: any
    proxy_: any[] = undefined as any
    lastKnownLength_ = 0

    constructor(
        name,
        enhancer: IEnhancer<any>,
        public owned_: boolean,
        public legacyMode_: boolean
    ) {
        this.atom_ = new Atom(name || "ObservableArray@" + getNextId())
        this.enhancer_ = (newV, oldV) => enhancer(newV, oldV, name + "[..]")
    }

    dehanceValue_(value: any): any {
        if (this.dehancer !== undefined) return this.dehancer(value)
        return value
    }

    dehanceValues_(values: any[]): any[] {
        if (this.dehancer !== undefined && values.length > 0)
            return values.map(this.dehancer) as any
        return values
    }

    // TODO: rename
    intercept(handler: IInterceptor<IArrayWillChange<any> | IArrayWillSplice<any>>): Lambda {
        return registerInterceptor<IArrayWillChange<any> | IArrayWillSplice<any>>(this, handler)
    }

    observe(
        listener: (changeData: IArrayChange<any> | IArraySplice<any>) => void,
        fireImmediately = false
    ): Lambda {
        if (fireImmediately) {
            listener(<IArraySplice<any>>{
                object: this.proxy_ as any,
                type: "splice",
                index: 0,
                added: this.values_.slice(),
                addedCount: this.values_.length,
                removed: [],
                removedCount: 0
            })
        }
        return registerListener(this, listener)
    }

    getArrayLength_(): number {
        this.atom_.reportObserved()
        return this.values_.length
    }

    setArrayLength_(newLength: number) {
        if (typeof newLength !== "number" || newLength < 0) die("Out of range: " + newLength)
        let currentLength = this.values_.length
        if (newLength === currentLength) return
        else if (newLength > currentLength) {
            const newItems = new Array(newLength - currentLength)
            for (let i = 0; i < newLength - currentLength; i++) newItems[i] = undefined // No Array.fill everywhere...
            this.spliceWithArray_(currentLength, 0, newItems)
        } else this.spliceWithArray_(newLength, currentLength - newLength)
    }

    updateArrayLength_(oldLength: number, delta: number) {
        if (oldLength !== this.lastKnownLength_) die(16)
        this.lastKnownLength_ += delta
        if (this.legacyMode_ && delta > 0) reserveArrayBuffer(oldLength + delta + 1)
    }

    spliceWithArray_(index: number, deleteCount?: number, newItems?: any[]): any[] {
        checkIfStateModificationsAreAllowed(this.atom_)
        const length = this.values_.length

        if (index === undefined) index = 0
        else if (index > length) index = length
        else if (index < 0) index = Math.max(0, length + index)

        if (arguments.length === 1) deleteCount = length - index
        else if (deleteCount === undefined || deleteCount === null) deleteCount = 0
        else deleteCount = Math.max(0, Math.min(deleteCount, length - index))

        if (newItems === undefined) newItems = EMPTY_ARRAY

        if (hasInterceptors(this)) {
            const change = interceptChange<IArrayWillSplice<any>>(this as any, {
                object: this.proxy_ as any,
                type: SPLICE,
                index,
                removedCount: deleteCount,
                added: newItems
            })
            if (!change) return EMPTY_ARRAY
            deleteCount = change.removedCount
            newItems = change.added
        }

        newItems =
            newItems.length === 0 ? newItems : newItems.map(v => this.enhancer_(v, undefined))
        if (this.legacyMode_ || __DEV__) {
            const lengthDelta = newItems.length - deleteCount
            this.updateArrayLength_(length, lengthDelta) // checks if internal array wasn't modified
        }
        const res = this.spliceItemsIntoValues_(index, deleteCount, newItems)

        if (deleteCount !== 0 || newItems.length !== 0)
            this.notifyArraySplice_(index, newItems, res)
        return this.dehanceValues_(res)
    }

    spliceItemsIntoValues_(index, deleteCount, newItems: any[]): any[] {
        if (newItems.length < MAX_SPLICE_SIZE) {
            return this.values_.splice(index, deleteCount, ...newItems)
        } else {
            const res = this.values_.slice(index, index + deleteCount)
            this.values_ = this.values_
                .slice(0, index)
                .concat(newItems, this.values_.slice(index + deleteCount))
            return res
        }
    }

    notifyArrayChildUpdate_(index: number, newValue: any, oldValue: any) {
        const notifySpy = !this.owned_ && isSpyEnabled()
        const notify = hasListeners(this)
        const change =
            notify || notifySpy
                ? {
                      object: this.proxy_,
                      type: UPDATE,
                      index,
                      newValue,
                      oldValue
                  }
                : null

        // The reason why this is on right hand side here (and not above), is this way the uglifier will drop it, but it won't
        // cause any runtime overhead in development mode without NODE_ENV set, unless spying is enabled
        if (__DEV__ && notifySpy) spyReportStart({ ...change, name: this.atom_.name_ })
        this.atom_.reportChanged()
        if (notify) notifyListeners(this, change)
        if (__DEV__ && notifySpy) spyReportEnd()
    }

    notifyArraySplice_(index: number, added: any[], removed: any[]) {
        const notifySpy = !this.owned_ && isSpyEnabled()
        const notify = hasListeners(this)
        const change =
            notify || notifySpy
                ? {
                      object: this.proxy_,
                      type: SPLICE,
                      index,
                      removed,
                      added,
                      removedCount: removed.length,
                      addedCount: added.length
                  }
                : null

        if (__DEV__ && notifySpy) spyReportStart({ ...change, name: this.atom_.name_ })
        this.atom_.reportChanged()
        // conform: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/observe
        if (notify) notifyListeners(this, change)
        if (__DEV__ && notifySpy) spyReportEnd()
    }
}

export function createObservableArray<T>(
    initialValues: T[] | undefined,
    enhancer: IEnhancer<T>,
    name = "ObservableArray@" + getNextId(),
    owned = false
): IObservableArray<T> {
    assertProxies()
    const adm = new ObservableArrayAdministration(name, enhancer, owned, false)
    addHiddenFinalProp(adm.values_, $mobx, adm)
    const proxy = new Proxy(adm.values_, arrayTraps) as any
    adm.proxy_ = proxy
    if (initialValues && initialValues.length) {
        const prev = allowStateChangesStart(true)
        adm.spliceWithArray_(0, 0, initialValues)
        allowStateChangesEnd(prev)
    }
    return proxy
}

// eslint-disable-next-line
export var arrayExtensions = {
        clear(): any[] {
            return this.splice(0)
        },

        replace(newItems: any[]) {
            const adm: ObservableArrayAdministration = this[$mobx]
            return adm.spliceWithArray_(0, adm.values_.length, newItems)
        },

        // Used by JSON.stringify
        toJSON(): any[] {
            return this.slice()
        },

        /*
         * functions that do alter the internal structure of the array, (based on lib.es6.d.ts)
         * since these functions alter the inner structure of the array, the have side effects.
         * Because the have side effects, they should not be used in computed function,
         * and for that reason the do not call dependencyState.notifyObserved
         */
        splice(index: number, deleteCount?: number, ...newItems: any[]): any[] {
            const adm: ObservableArrayAdministration = this[$mobx]
            switch (arguments.length) {
                case 0:
                    return []
                case 1:
                    return adm.spliceWithArray_(index)
                case 2:
                    return adm.spliceWithArray_(index, deleteCount)
            }
            return adm.spliceWithArray_(index, deleteCount, newItems)
        },

        spliceWithArray(index: number, deleteCount?: number, newItems?: any[]): any[] {
            return (this[$mobx] as ObservableArrayAdministration).spliceWithArray_(
                index,
                deleteCount,
                newItems
            )
        },

        push(...items: any[]): number {
            const adm: ObservableArrayAdministration = this[$mobx]
            adm.spliceWithArray_(adm.values_.length, 0, items)
            return adm.values_.length
        },

        pop() {
            return this.splice(Math.max(this[$mobx].values_.length - 1, 0), 1)[0]
        },

        shift() {
            return this.splice(0, 1)[0]
        },

        unshift(...items: any[]): number {
            const adm: ObservableArrayAdministration = this[$mobx]
            adm.spliceWithArray_(0, 0, items)
            return adm.values_.length
        },

        reverse(): any[] {
            // reverse by default mutates in place before returning the result
            // which makes it both a 'derivation' and a 'mutation'.
            // so we deviate from the default and just make it an dervitation
            if (__DEV__) {
                console.warn(
                    "[mobx] `observableArray.reverse()` will not update the array in place. Use `observableArray.slice().reverse()` to suppress this warning and perform the operation on a copy, or `observableArray.replace(observableArray.slice().reverse())` to reverse & update in place"
                )
            }
            const clone = (<any>this).slice()
            return clone.reverse.apply(clone, arguments)
        },

        sort(): any[] {
            // sort by default mutates in place before returning the result
            // which goes against all good practices. Let's not change the array in place!
            if (__DEV__) {
                console.warn(
                    "[mobx] `observableArray.sort()` will not update the array in place. Use `observableArray.slice().sort()` to suppress this warning and perform the operation on a copy, or `observableArray.replace(observableArray.slice().sort())` to sort & update in place"
                )
            }
            const clone = (<any>this).slice()
            return this.slice().sort.apply(clone, arguments)
        },

        remove(value: any): boolean {
            const adm: ObservableArrayAdministration = this[$mobx]
            const idx = adm.dehanceValues_(adm.values_).indexOf(value)
            if (idx > -1) {
                this.splice(idx, 1)
                return true
            }
            return false
        },

        // TODO: move to array administration
        get(index: number): any | undefined {
            const adm: ObservableArrayAdministration = this[$mobx]
            if (adm) {
                if (index < adm.values_.length) {
                    adm.atom_.reportObserved()
                    return adm.dehanceValue_(adm.values_[index])
                }
                console.warn(
                    __DEV__
                        ? `[mobx] Out of bounds read: ${index}`
                        : `[mobx.array] Attempt to read an array index (${index}) that is out of bounds (${adm.values_.length}). Please check length first. Out of bound indices will not be tracked by MobX`
                )
            }
            return undefined
        },

        // TODO: move to array administration
        set(index: number, newValue: any) {
            const adm: ObservableArrayAdministration = this[$mobx]
            const values = adm.values_
            if (index < values.length) {
                // update at index in range
                checkIfStateModificationsAreAllowed(adm.atom_)
                const oldValue = values[index]
                if (hasInterceptors(adm)) {
                    const change = interceptChange<IArrayWillChange<any>>(adm as any, {
                        type: UPDATE,
                        object: adm.proxy_ as any, // since "this" is the real array we need to pass its proxy
                        index,
                        newValue
                    })
                    if (!change) return
                    newValue = change.newValue
                }
                newValue = adm.enhancer_(newValue, oldValue)
                const changed = newValue !== oldValue
                if (changed) {
                    values[index] = newValue
                    adm.notifyArrayChildUpdate_(index, newValue, oldValue)
                }
            } else if (index === values.length) {
                // add a new item
                adm.spliceWithArray_(index, 0, [newValue])
            } else {
                // out of bounds
                die(17, index, values.length)
            }
        }
    }

    /**
     * Wrap function from prototype
     * Without this, everything works as well, but this works
     * faster as everything works on unproxied values
     */
;[
    "concat",
    "every",
    "filter",
    "forEach",
    "indexOf",
    "join",
    "lastIndexOf",
    "map",
    "reduce",
    "reduceRight",
    "slice",
    "some",
    "toString",
    "toLocaleString"
].forEach(funcName => {
    arrayExtensions[funcName] = function() {
        const adm: ObservableArrayAdministration = this[$mobx]
        adm.atom_.reportObserved()
        const res = adm.dehanceValues_(adm.values_)
        return res[funcName].apply(res, arguments)
    }
})

const isObservableArrayAdministration = createInstanceofPredicate(
    "ObservableArrayAdministration",
    ObservableArrayAdministration
)

export function isObservableArray(thing): thing is IObservableArray<any> {
    return isObject(thing) && isObservableArrayAdministration(thing[$mobx])
}
