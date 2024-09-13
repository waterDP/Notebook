export function pipeFromArray(fns) {
  if (fns.length === 0) {
    return (x) => x;
  }
  if (fns.length === 1) {
    return fns[0];
  }
  return function (input) {
    return fns.reduce((prev, fn) => fn(prev), input);
  };
}
