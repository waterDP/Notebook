/**
 * @param {function} funcs
 * @return {function}
 */
function compose(...funcs){
  return funcs.reduce((func, next) => (...args) => func(next(...args)));
}
export default compose;