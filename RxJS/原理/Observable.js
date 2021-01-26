import {root} from './util/root'
import {toSubscriber} from './util/toSubscriber'
import {observable as Symbol_observable} from './symbol/observable'

/**
 *  表示在任意时间内的一组值，这是Rxjs最基本的构建块
 * @class Observable<T>
 */
class Observable {
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
    
  }

}