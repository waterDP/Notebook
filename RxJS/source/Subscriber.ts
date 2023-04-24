export class Subscriber<T> {
  constructor(
    private _next?: (value: T) => void,
    private _error?: ((error: any) => void) | null,
    private _complete?: (() => void) | null
  ) {}

  next(value: T) {
    this._next && this._next(value);
  }

  error(err: any) {
    this._error && this._error(err);
  }

  complete() {
    this._complete && this._complete();
  }
}
