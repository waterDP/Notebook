function add1(str){
    return '1'+str;
}
function add2(str){
    return '2'+str;
}
function add3(str){
    return '3'+str;
}
function compose1(...funcs){
  return function(...args){
    let result;
    /* for(let i=funcs.length-1;i>=0;i--){
      let func = funcs[i];
      result = func(i==funcs.length-1?args:result);
    } */
    let i=funcs.length-1;
    while(i>=0){
      let func = funcs[i];
      result = func(i==funcs.length-1?args:result);
      i--;
    }
    return result;
  }
}
//let result = compose(add1,add2,add3)('zhufeng');
//console.log(result);// 123zhufeng
function compose(...funcs){
  return funcs.reduce((a,b)=>(...args)=>a(b(...args)));
}
export default compose;