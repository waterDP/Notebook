export type Annotation = {
    annotationType_:
        | "observable"
        | "observable.ref"
        | "observable.shallow"
        | "observable.struct"
        | "computed"
        | "computed.struct"
        | "action"
        | "action.bound"
    arg_?: any
}

export type AnnotationMapEntry =
    | Annotation
    | true /* follow the default decorator, usually deep */
    | false /* don't decorate this property */

// AdditionalFields can be used to declare additional keys that can be used, for example to be able to
// declare annotations for private/ protected members, see #2339
export type AnnotationsMap<T, AdditionalFields extends PropertyKey> = Partial<
    | Record<keyof T, AnnotationMapEntry>
    | (AdditionalFields extends never ? never : Record<AdditionalFields, AnnotationMapEntry>)
>
