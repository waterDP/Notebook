import {
    asObservableObject,
    addHiddenProp,
    action,
    isAction,
    computed,
    observable,
    AnnotationsMap,
    Annotation,
    getEnhancerFromAnnotation,
    endBatch,
    startBatch,
    CreateObservableOptions,
    ObservableObjectAdministration,
    applyDecorators,
    isObservableProp,
    getDescriptor,
    isPlainObject,
    isObservableObject,
    isFunction,
    die,
    ACTION,
    ACTION_BOUND,
    COMPUTED,
    COMPUTED_STRUCT,
    OBSERVABLE,
    OBSERVABLE_REF,
    OBSERVABLE_SHALLOW,
    OBSERVABLE_STRUCT
} from "../internal"

function makeAction(target, key, name, fn) {
    addHiddenProp(target, key, action(name || key, fn))
}

function getInferredAnnotation(
    desc: PropertyDescriptor,
    defaultAnnotation: Annotation | undefined
): Annotation | boolean {
    if (desc.get) return computed
    if (desc.set) return false // ignore pure setters
    // if already wrapped in action, don't do that another time, but assume it is already set up properly
    if (isFunction(desc.value)) return isAction(desc.value) ? false : action.bound
    // if (!desc.configurable || !desc.writable) return false
    return defaultAnnotation ?? observable.deep
}

function getDescriptorInChain(target: Object, prop: PropertyKey): [PropertyDescriptor, Object] {
    let current = target
    while (current && current !== Object.prototype) {
        // TODO: cache meta data, especially for members from prototypes?
        const desc = getDescriptor(current, prop)
        if (desc) {
            return [desc, current]
        }
        current = Object.getPrototypeOf(current)
    }
    die(1, prop)
}

export function makeProperty(
    adm: ObservableObjectAdministration,
    owner: Object,
    key: PropertyKey,
    descriptor: PropertyDescriptor,
    annotation: Annotation | boolean,
    forceCopy: boolean // extend observable will copy even unannotated properties
): void {
    const { target_: target } = adm
    const defaultAnnotation: Annotation | undefined = observable // TODO: grap this from adm instead!
    const origAnnotation = annotation
    if (annotation === true) {
        annotation = getInferredAnnotation(descriptor, defaultAnnotation)
    }
    if (annotation === false) {
        if (forceCopy) {
            // TODO: create util?
            Object.defineProperty(target, key, descriptor)
        }
        return
    }
    if (!annotation || annotation === true || !annotation.annotationType_) {
        return die(2, key)
    }
    switch (annotation.annotationType_) {
        case ACTION: {
            const fn = descriptor.value
            if (!isFunction(fn)) die(3, key)
            if (owner !== target && !forceCopy) {
                if (!isAction(owner[key])) makeAction(owner, key, annotation.arg_, fn)
            } else {
                makeAction(target, key, annotation.arg_, fn)
            }
            break
        }
        case ACTION_BOUND: {
            const fn = descriptor.value
            if (!isFunction(fn)) die(3, key)
            makeAction(target, key, annotation.arg_, fn.bind(adm.proxy_ || target))
            break
        }
        case COMPUTED:
        case COMPUTED_STRUCT: {
            if (!descriptor.get) die(4, key)
            // TODO: add to target or proto?
            adm.addComputedProp_(target, key, {
                get: descriptor.get,
                set: descriptor.set,
                compareStructural: annotation.annotationType_ === COMPUTED_STRUCT,
                ...annotation.arg_
            })
            break
        }
        case OBSERVABLE:
        case OBSERVABLE_REF:
        case OBSERVABLE_SHALLOW:
        case OBSERVABLE_STRUCT: {
            if (__DEV__ && isObservableProp(target, key as any))
                die(
                    `Cannot decorate '${key.toString()}': the property is already decorated as observable.`
                )
            if (__DEV__ && !("value" in descriptor))
                die(
                    `Cannot decorate '${key.toString()}': observable cannot be used on setter / getter properties.`
                )
            // if the origAnnotation was true, preferred the adm's default enhancer over the inferred one
            const enhancer =
                origAnnotation === true
                    ? adm.defaultEnhancer_
                    : getEnhancerFromAnnotation(annotation)
            adm.addObservableProp_(key, descriptor.value, enhancer)
            break
        }
        default:
            if (__DEV__)
                die(
                    `invalid decorator '${annotation.annotationType_ ??
                        annotation}' for '${key.toString()}'`
                )
    }
}

export function makeObservable<T extends Object, AdditionalKeys extends PropertyKey = never>(
    target: T,
    annotations?: AnnotationsMap<T, AdditionalKeys>,
    options?: CreateObservableOptions
) {
    const adm = asObservableObject(
        target,
        options?.name,
        getEnhancerFromAnnotation(options?.defaultDecorator)
    )
    startBatch()
    try {
        if (!annotations) {
            const didDecorate = applyDecorators(target)
            if (__DEV__ && !didDecorate)
                die(
                    `No annotations were passed to makeObservable, but no decorator members have been found either`
                )
            return
        }
        const make = key => {
            let annotation = annotations[key]
            const [desc, owner] = getDescriptorInChain(target, key)
            makeProperty(adm, owner, key, desc, annotation, false)
        }
        Object.getOwnPropertyNames(annotations).forEach(make)
        Object.getOwnPropertySymbols(annotations).forEach(make) // TODO: check if available everywhere
    } finally {
        endBatch()
    }
    return target
}

// TODO: add tests
export function makeAutoObservable<T extends Object, AdditionalKeys extends PropertyKey = never>(
    target: T,
    excludes?: AnnotationsMap<T, AdditionalKeys>,
    options?: CreateObservableOptions
): T {
    const proto = Object.getPrototypeOf(target)
    const isPlain = proto == null || proto === Object.prototype
    if (__DEV__) {
        if (!isPlain && !isPlainObject(proto))
            die(`'makeAutoObservable' can only be used for classes that don't have a superclass`)
        if (isObservableObject(target))
            die(`makeAutoObservable can only be used on objects not already made observable`)
    }
    let annotations = { ...excludes }
    extractAnnotationsFromObject(target, annotations, options)
    if (!isPlain) {
        extractAnnotationsFromProto(proto, annotations)
    }
    makeObservable(target, annotations, options)
    return target
}

function extractAnnotationsFromObject(
    target,
    collector: AnnotationsMap<any, any>,
    options: CreateObservableOptions | undefined
) {
    const defaultAnnotation: Annotation = options?.deep
        ? observable.deep
        : options?.defaultDecorator ?? observable.deep
    // TODO: util for getOwnDescriptors?
    Object.entries(Object.getOwnPropertyDescriptors(target)).forEach(([key, descriptor]) => {
        if (key in collector || key === "constructor") return
        collector[key] = getInferredAnnotation(descriptor, defaultAnnotation)
    })
}

function extractAnnotationsFromProto(proto: any, collector: AnnotationsMap<any, any>) {
    // TODO: for this combo, craeate a utility, looks same as above
    Object.entries(Object.getOwnPropertyDescriptors(proto)).forEach(([key, prop]) => {
        if (key in collector || key === "constructor") return
        if (prop.get) {
            collector[key as any] = computed
        } else if (isFunction(prop.value)) {
            collector[key as any] = action.bound
        }
    })
}
