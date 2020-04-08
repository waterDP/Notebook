// todo  在一个未排序的数组中找出是否有任意两个数之和等于给定的数
/* 
  1.循环遍历数组，let subStract = num - arr[i]
  2.如果differ[subStract]里有值，则返回true; 如果没有，将differ[arr[i]]置为true
*/

/**
 * @param {Array} arr
 * @param {Number} num
 * @return {Boolean}
 */
function sumFind(arr, num) {
  if (!arr || arr.length < 2) {
    return false
  }
  const differ = {}
  for (let i = 0; i < arr.length; i++) {
    let subStruct = num - arr[i]
    if (differ[subStruct]) {
      return true
    }
    differ[arr[i]] = true
  }
  return false
}