export class Scheduler {
  constructor(schedulerActionCtor) {
    this.schedulerActionCtor = schedulerActionCtor;
  }
  schedule(work, delay = 0, state) {
    return new this.schedulerActionCtor(work).schedule(state, delay);
  }
}
