function compose(...funcs){
  return funcs.reduce((a,b)=>(...args)=>a(b(...args)));
}
export default compose;