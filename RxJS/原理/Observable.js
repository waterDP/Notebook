import { toSubscriber } from './util/toSubscriber'
import { observable as Symbol_observable } from './symbol/observable'

/**
 *  表示在任意时间内的一组值，这是Rxjs最基本的构建块
 * @class Observable<T>
 */
export class Observable {
  /**
   * @constructor
   * @param {Function} subscribe 当Observable初始订阅的时候会调用该方法
   */
  constructor(subscribe) {
    this._isScalar = false
    if (subscribe) {
      this._subscribe = subscribe
    }
  }

  /**
   * 创建一个新的Observable，以它为源，并传递操作符作为新的observable操作符
   * @method lift
   * @param {Operator} Operator定义了如何操作observable的操作符
   * @return {Observable} 应用了操作符的新observable 
   */
  lift(operator) {
    const observable = new Observable()
    observable.source = this
    observable.operator = operator
    return observable
  }

  /**
   * @method pipe
   * @param {OperatorFunction[]}
   * @return {Observable}
   *  */
  pipe(...operations) {
    if (operations.length === 0) {
      return this
    }
    if (operations.length === 1) {
      return operations[0]
    }

    return operations.reduce((prev, curr) => curr(prev), this)  // compose
  }

  /**
   * @method subscribe
   * @param {Observer|Function} 
   */
  subscribe(observerOrNext, error, complete) {
    const { operator } = this
    const sink = toSubscriber(observerOrNext, error, complete)
    if (operator) {
      operator.call(sink, this.source)
    } else {
      sink.add(this.source ? this._subscribe(sink) : this._trySubscribe(sink))
    }
    if (sink.syncErrorThrowable) {
      sink.syncErrorThrowable = false
      if (sink.syncErrorThrown) {
        throw sink.syncErrorValue
      }
    }
  }

  _trySubscribe(sink) {
    try {
      return this._subscribe(sink);
    }
    catch (err) {
      sink.syncErrorThrown = true;
      sink.syncErrorValue = err;
      sink.error(err);
    }
  }

  /**
   * @method forEach
   * @param {Function} next observable发出的每值的处理器
   * @param {PromiseConstructor} [PromiseCtor] 用来生成Promise的构造函数
   * @return {Promise} 一个observable完成则resolve,错误则reject的promise
   */
  forEach(next, PromiseCtor) {
    return new PromiseCtor((resolve, reject) => {
      let subscription
      subscription = this.subscribe(value => {
        if (subscription) {
          try {
            next(value)
          } catch(err) {
            reject(err)
            subscription.unsubscribe()
          }
        } else {
          next(value)
        }
      }, reject, resolve)
    })
  }

  _subscribe(subscriber) {
    return this.source.subscribe(subscriber)
  }

  static create(subscribe) {
    return new Observable(subscribe)
  }

}