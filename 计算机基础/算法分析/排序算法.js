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
  // [arr[i], arr[j]] = [arr[j], arr[i]]
}

// todo 冒泡排序
// 平均O(n^2) 最好情况O(1) 最坏情况O(n^2) 空间O(1) 稳定性 稳定
function bubble_sort(arr) {
  for (let i = arr.length; i > 0; i--) {
    for (let j = 1; j < i; j++) {
      if (arr[j] < arr[j - 1]) {
        swap(arr, j, j - 1)
      }
    }
  }
}

// todo 选择排序 
// 平均O(n^2) 最好情况O(n^2) 最坏情况O(n^2) 空间O(1) 稳定性 不稳定
function selection_sort(arr) {
  const len = arr.length
  let minIndex, temp
  for (let i = 0; i < len -1; i++) {
    minIndex = i
    for (let j = i + 1; j < len; j++) {
      if (arr[j] < arr[minIndex]) { // 寻找最小的数
        minIndex = j // 将最小数的索引保存
      }
    }
    swap(arr, i, minIndex)
  }
  return arr
}

// todo 插入排序
// 平均O(n^2) 最好情况O(n) 最坏情况O(n^2) 空间O(1) 稳定性 稳定
function insertion_sort(arr) {
  const len = arr.length
  let preIndex, current
  for (let i = 1; i < len; i++) {
    preIndex = i - 1
    current = arr[i]
    while(preIndex >= 0 && arr[preIndex] > current) {
      arr[preIndex+1] = arr[preIndex]
      preIndex--
    }
    arr[preIndex] = current
  }
  return arr
}

// todo 希尔排序 
// 平均O(n log n) 最好情况O(n log2 n) 最坏情况O(n log2 n) 空间O(1) 稳定性 不稳定
function shell_sort(arr) {
  const len = arr.length
  let temp, gap = 1
  while(gap < len / 3) {
    gap = gap*3 + 1
  }
  let i, j
  for (gap; gap > 0; gap = Math.floor(gap/3)) {
    for (i = gap; i < len; i++) {
      temp = arr[i]
      for (j = i - gap; j > 0 && arr[j] > temp; j -= gap) {
        arr[j+gap] = arr[j]
      }
      arr[j+gap] = temp
    }
  }
  return arr
}

// todo 归并排序(分冶策略)
// 平均O(n log n) 最好情况O(n log n) 最坏情况O(n log n) 空间O(n) 稳定性 稳定
function merge_sort(arr) { // 采用自上而下的递归方法
  const len = arr.length
  if (len < 2) {
    return arr
  }
  let middle = Math.floor(len /2) // 向下取整
  let left = arr.slice(0, middle)
  let right = arr.slice(middle)

  return merge(merge_sort(left), merge_sort(right))

  function merge(left, right) {
    let result = []
    while (left.length > 0 && right.length > 0) {
      if (left[0] <= right[0]) {
        result.push(left.shift())
      } else {
        result.push(right.shift())
      }
    }

    while(left.length)
      result.push(left.shift())

    while(right.length) 
      result.push(right.shift())  

    return result
  }
}

console.log('merge_sort', merge_sort([1,7,6,4,5,3,2]))

// todo 快速排序(分冶)
// 平均O(n log n) 最好情况O(n log n) 最坏情况O(n^2) 空间O(log n) 稳定性 不稳定
function quick_sort(arr, left, right) {
  const len = arr.length
  let partitionIndex
  left = typeof left !== 'number' ? 0 : left
  right = typeof right !== 'number' ? len - 1 : right

  if (left < right) {
    partitionIndex = partition(arr, left, right)
    quick_sort(arr, left, partitionIndex - 1)
    quick_sort(arr, partitionIndex + 1, right)
  }
  return arr

  function partition(arr, left, right) { // 分区操作
    let pivot = left, index = pivot + 1   // 设定基准值(pivot)
    for (let i = index; i <= right; i++) {
      if (arr[i] < arr[pivot]) {
        swap(arr, i, index)
        index++
      }
      // console.log(arr)
    }
    swap(arr, pivot, index - 1)
    return index - 1
  }
}

console.log(quick_sort([6,7,1,3,5,0]))

// todo shuffle 随机洗牌
function shuffle(arr) {
  const copy = [...arr]
  let i = copy.length - 1
  while(i > 0) {
    const randomIndex = Math.floor(Math.random() * (i--)) 
    [copy[i], copy[randomIndex]] = [copy[randomIndex], copy[i]]
  }
  return copy
}

// todo 堆排序
// 平均O(n log n) 2最好情况O(n log n) 最坏情况O(n^2) 空间O(log n) 不稳定
/**
 * 推排序可以说一种艇推的概念来排序的选择排序。分为两种方法 
 * 大顶堆：每个节点的值都大于或等于其子节点的值，在推排序中用于升序排列
 * 小顶推：每个节点的值者小于或等于其子节点的值，在推排序算法用于降序排列
 */
function heap_sort(arr) {
  let len
  buildMaxHead(arr)
  for (let i = arr.length -1; i>0; i--) {
    swap(arr, 0, i)
    len--
    sift(arr, 0)
  }
  return arr
  
  function swap(arr, i, j) {
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }

  function buildMaxHead(arr) { // 建立大顶推
    len = arr.length
    for (let i = Math.floor(len/2); i >= 0; i--) {
      sift(arr, i)
    }
  }

  function sift(arr, i) { // 堆调整
    let left = i * 2 + 1
    let right = i * 2 + 2
    let largest = i

    if (left < len && arr[left] > arr[largest]) {
      largest = left
    }

    if (right < len && arr[right] > arr[largest]) {
      largest = right
    }

    if (largest !== i) {
      swap(arr, i, largest)
      sift(arr, largest)
    }
  }
}

// todo 计数排序
// 平均O(n+k) 最好情况O(n+k) 最坏情况O(n+k) 空间O(k) 稳定性 稳定 
// todo 桶排序
// 平均O(n+k) 最好情况O(n+k) 最坏情况O(n^2) 空间(n+k) 稳定性 稳定
// todo 基数排序
// 平均O(nxk) 最好情况O(nxk) 最坏情况O(n+k) 空间(n+k) 稳定性 稳定
function radio_sort(arr) {
  if (!arr || arr.length < 2) {
    return arr
  }
  let len = arr.length
  let max = arr[0]
  // 找出最大值
  for (let i = 1; i < len; i++) {
    max = (max < arr[i]) ? arr[i] : max 
  }
  // 计算出最大数是几位
  let num = 1
  while (max / 10 > 0) {
    num++
    max = Math.floor(max / 10)
  }
  // 创建出10个桶
  let arrList = new Array(10)
  function init() {
    for(let i = 0; i < 10; i++) {
      arrList[i] = []
    }
  }
  init()

  // 进行每趟排序，从个位开始排
  for (let i = 1; i < num; i++) {
    for (let j = 0; j < len; j++) {
      // 获取每个数最后第i位的数
      let radio = Math.floor((arr[j]/Math.pow(10, i - 1)) % 10)
      arrList[radio].push(arr[j])
    }

    // 合并放回原数组
    let k = 0
    for (let j = 0; j < 10; j++) {
      arrList[j].forEach(item => {
        arr[k++] = item
      })
    }
    // 清空桶
    init()
  }
  return arr
}