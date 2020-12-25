
export default function isPlainObject(obj) {
  if (typeof obj != 'object' || obj === null) {
    return false;
  }
  return Object.getPrototypeOf(obj) === Object.prototype
}