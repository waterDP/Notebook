export class AsyncAction {
  peding = false;
  constructor(work) {
    this.work = work;
  }
  schedule(state, delay = 0) {
    this.state = state;
    this.delay = delay;
    if (this.timerID) {
      this.timerID = this.recycleAsyncId(this.timerID);
    }
    this.pending = true;
    this.timerID = this.requestAsyncId(delay);
  }
  recycleAsyncId(timerID) {
    if (timerID) {
      clearInterval(timerID);
    }
    return null;
  }
  requestAsyncId(delay = 0) {
    return setInterval(this.execute.bind(this), delay);
  }
  execute() {
    this.pending = false;
    this.work(this.state);
    if (!this.pending && this.timerID) {
      this.timerID = this.recycleAsyncId(this.timerID);
    }
  }
}
