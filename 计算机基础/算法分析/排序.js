/**
 * 交换
 * @param {Array} arr 
 * @param {Number} i
 * @param {Number} j
 */
function swap(arr, i, j) {
  const temp = arr[i]
  arr[i] = arr[j]
  arr[j] = temp
}

// todo 冒泡排序
function bubble_sort(arr) {
  for (let i = arr.length; i > 0; i--) {
    for (let j = 1; j < i; j++) {
      if (arr[j] < arr[j - 1]) {
        swap(arr, j, j - 1)
      }
    }
  }
}

