// todo 二分
/** 
 * 思想
 * 针对有序数列进行查找时，优先考虑二分
 * 输入一个非递减的数组的一个旋转，输出旋转数组的最小元素 
 */
// 例如数组{3,4,5,1,2}为{1,2,3,4,5}的一个旋转，该数组的最小值为1。
// NOTE：给出的所有元素都大于0，若数组大小为0，请返回0。
//把一个数组最开始的若干个元素搬到数组的末尾，我们称之为数组的旋转。
/*   
1. 原数据为旋转数组，所以分界点前后都是有序的
2. 进行二分查找，注意因为找最小值，high赋值时应该从mid开始取，mid可能是最小值
*/
function minNumberInRateArray(rotateArray) {
  if (!rotateArray.length) return 0
  let left = 0, right = rotateArray.length - 1
  while(left < right) {
    let mid = Math.floor((right+left) >> 1)
    if (rotateArray[left] <= rotateArray[right]) {
      return rotateArray[left]
    }
    if (rotateArray[left] < rotateArray[mid]) {
      left = mid+1
    } else if (rotateArray[right] > rotateArray[mid]) {
      right = mid
    } else {
      left++
    }
  }
}