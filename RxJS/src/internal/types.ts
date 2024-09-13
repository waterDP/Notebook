import { Observable } from "./Observable";
import { Subscription } from "./Subscription";

declare global {
  interface SymbolConstructor {
    readonly observable: symbol;
  }
}

export interface UnaryFunction<T, R> {
  (source: T): R;
}

export interface OperatorFunction<T, R>
  extends UnaryFunction<Observable<T>, Observable<R>> {}

export type FactoryOrValue<T> = T | (() => T);

export interface MonoTypeOperatorFunction<T> extends OperatorFunction<T, T> {}

/**
 * @see {@link timestamp}
 */
export interface Timestamp<T> {
  value: T;
  timestamp: number;
}

export interface TimeInterval<T> {
  value: T;

  interval: number;
}

export interface Unsubscribable {
  unsubscribe(): void;
}

export type TeardownLogic = Subscription | Unsubscribable | (() => void) | void;

export interface SubscriptionLike extends Unsubscribable {
  unsubscribe(): void;
  readonly closed: boolean;
}

export interface Subscribable<T> {
  subscribe(observer: Partial<Observer<T>>): Unsubscribable;
}

export type ObservableInput<T> =
  | Observable<T>
  | InteropObservable<T>
  | AsyncIterable<T>
  | PromiseLike<T>
  | ArrayLike<T>
  | Iterable<T>
  | ReadableStreamLike<T>;

export interface InteropObservable<T> {
  [Symbol.observable]: () => Subscribable<T>;
}

export interface NextNotification<T> {
  kind: "N";
  value: T;
}

export interface ErrorNotification {
  kind: "E";
  error: any;
}

export interface CompleteNotification {
  kind: "C";
}

export type ObservableNotification<T> =
  | NextNotification<T>
  | ErrorNotification
  | CompleteNotification;

export interface NextObserver<T> {
  closed?: boolean;
  next: (value: T) => void;
  error?: (err: any) => void;
  complete?: () => void;
}

export interface ErrorObserver<T> {
  closed?: boolean;
  next?: (value: T) => void;
  error: (err: any) => void;
  complete?: () => void;
}

export interface CompletionObserver<T> {
  closed?: boolean;
  next?: (value: T) => void;
  error?: (err: any) => void;
  complete: () => void;
}

export type PartialObserver<T> =
  | NextObserver<T>
  | ErrorObserver<T>
  | CompletionObserver<T>;

export interface Observer<T> {
  next: (value: T) => void;
  error: (err: any) => void;
  complete: () => void;
}

export interface SubjectLike<T> extends Observer<T>, Subscribable<T> {}

export interface SchedulerLike extends TimestampProvider {
  schedule<T>(
    work: (this: SchedulerAction<T>, state: T) => void,
    delay: number,
    state: T
  ): Subscription;
  schedule<T>(
    work: (this: SchedulerAction<T>, state?: T) => void,
    delay: number,
    state?: T
  ): Subscription;
  schedule<T>(
    work: (this: SchedulerAction<T>, state?: T) => void,
    delay?: number,
    state?: T
  ): Subscription;
}

export interface SchedulerAction<T> extends Subscription {
  schedule(state?: T, delay?: number): Subscription;
}

export interface TimestampProvider {
  now(): number;
}

export type ObservedValueOf<O> = O extends ObservableInput<infer T> ? T : never;

export type ObservedValueUnionFromArray<X> = X extends Array<
  ObservableInput<infer T>
>
  ? T
  : never;

export type ObservedValueTupleFromArray<X> = {
  [K in keyof X]: ObservedValueOf<X[K]>;
};

export type ObservableInputTuple<T> = {
  [K in keyof T]: ObservableInput<T[K]>;
};

export type Cons<X, Y extends readonly any[]> = ((
  arg: X,
  ...rest: Y
) => any) extends (...args: infer U) => any
  ? U
  : never;

export type Head<X extends readonly any[]> = ((...args: X) => any) extends (
  arg: infer U,
  ...rest: any[]
) => any
  ? U
  : never;

export type Tail<X extends readonly any[]> = ((...args: X) => any) extends (
  arg: any,
  ...rest: infer U
) => any
  ? U
  : never;

export type ValueFromArray<A extends readonly unknown[]> = A extends Array<
  infer T
>
  ? T
  : never;

export type ValueFromNotification<T> = T extends { kind: "N" | "E" | "C" }
  ? T extends NextNotification<any>
    ? T extends { value: infer V }
      ? V
      : undefined
    : never
  : never;

export type Falsy = null | undefined | false | 0 | -0 | 0n | "";

export type TruthyTypesOf<T> = T extends Falsy ? never : T;

export type ReadableStreamLike<T> = Pick<ReadableStream<T>, "getReader">;

export interface Connectable<T> extends Observable<T> {
  connect(): Subscription;
}
