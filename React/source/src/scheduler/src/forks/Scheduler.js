export function scheduleCallback(callback) {
  requestIdleCallback(callback);
}
