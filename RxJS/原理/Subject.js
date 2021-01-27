import { Observable } from './Observable';
import { Subscriber } from './Subscriber';
import { Subscription } from './Subscription';
import { ObjectUnsubscribedError } from './util/ObjectUnsubscribedError';
import { SubjectSubscription } from './SubjectSubscription';
import { rxSubscriber as rxSubscriberSymbol } from './symbol/rxSubscriber';

export class SubjectSubscriber extends Subscriber {
  constructor(destination) {
    super(destination)
    this.destination = destination
  }
}

export class Subject extends Observable {
  constructor() {
    super()
    this.observers = []
    this.closed = false
    this.isStopped = false
    this.hasError = false
    this.throwError = null
  }
  [rxSubscriberSymbol]() {
    return new SubjectSubscriber()
  }
  lift(operator) {
    const subject = new AnonymousSubject(this, this)
    subject.operator = operator
    return object
  }
  
}