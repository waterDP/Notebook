
export default function isPlainObject(obj){
   if(typeof obj != 'object' || obj === null){
     return false;
   }
   return Object.getPrototypeOf(obj) === Object.prototype;
 /*   let xx = obj;
   while(Object.getPrototypeOf(xx)){//proto.__proto__.__proto__.__proto__ Object.prototype
    xx = Object.getPrototypeOf(xx);
   }
   return Object.getPrototypeOf(obj)  === xx; */
}