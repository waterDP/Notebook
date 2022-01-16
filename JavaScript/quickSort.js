/*
 * @Author: water.li
 * @Date: 2022-01-16 11:29:53
 * @Description: 快速排序
 * @FilePath: \notebook\JavaScript\quickSort.js
 */

function quickSort(arr, left, right) {
  left = typeof left === 'number' ? left : 0
  right = typeof right === 'number' ? right : arr.length - 1
  if (left < right) {
    let partitionIndex = partition(arr, left, right)
    quickSort(arr, left, partitionIndex - 1)
    quickSort(arr, partitionIndex + 1, right)
  }
  return arr
}

function partition(arr, left, right) {
  const swap = (i, j) => [arr[i], arr[j]] = [arr[j], arr[i]]

  let pivot = left, index = pivot + 1
  for (let i = index; i <= right; i++) {
    if (arr[i] < arr[pivot]) {
      swap(index, i)
      index++
    }
  }
  swap(pivot, index - 1)
  return index - 1
}

console.log(quickSort([2, 4, 1, 2, 6, 4, 10, 20, 3, 6]))