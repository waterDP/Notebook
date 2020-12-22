export function onlyOne(obj) {
  return Array.isArray(obj) ? obj[0] : obj
}