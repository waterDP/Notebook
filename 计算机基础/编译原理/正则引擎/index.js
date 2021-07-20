/*
 * @Description: 
 * @Date: 2021-07-20 10:08:36
 * @Author: water.li
 */

const collectionTypes = ['*', '+']

function testReg(str, reg) {
  if (!reg.startsWith('^') || !reg.endsWith('$')) {
    throw Error('format mismatch')
  }
  const generator = getGeneratorStart(reg)
  return isMatch(str, generator)
}
testReg('1324', '^[123]+[a]*3$')

function getGeneratorStart(reg) {
  const regStr = reg.slice(1, reg.length - 1)
  const patternObjList = getPatterObjList(regStr)
  const generator = getGenerator(patternObjList)
  return generator
}


/**
 * @description: 获取单元序列方法 
 * @param {string} regStr
 * @return {array}
 */
function getPatterObjList(regStr) {
  const len = regStr.length, 
        patternObjList = []
        collection = []
  let isInCollection = false

  for (let i = 0; i < len; i++) {
    const char = regStr[i]
    if (!isInCollection) {
      if (char !== '[') {
        patternObjList.push({
          isCollection: false,
          pattern: [char],
          next: []
        })
      } else {
        isInCollection = true
      }
    } else {
      if (char !== ']') {
        collection.push(char)
      } else {
        isInCollection = false

        let collectionSign = regStr[i + 1]
        let collectionType = 'COMMON'
        if (collectionSign && collectionTypes.includes(collectionSign)) {
          collectionType = collectionSign
          i++
        }
        patternObjList.push({
          isCollection: true,
          pattern: collection,
          collectionType,
          next: []
        })
        collection = []
      }
    }
  }
  return patternObjList
}

/* 
  输入：
^[123]+[a]*3$
输出：
[
  {
    isCollection: true,
    pattern: [ '1', '2', '3' ],
    collectionType: '+',
    next: []
  },
  {
    isCollection: true,
    pattern: [ 'a' ],
    collectionType: '*',
    next: []
  },
  { 
    isCollection: false, 
    pattern: [ '3' ], 
    next: [] 
   }
]
*/

/**
 * @description: 单元序列转换为自动机方法 
 * @param {array} patternObjList
 * @return {*}
 */
function getGenerator(patternObjList) {
  patternObjList.push({
    isEnd: true
  })
  const start = {
    isStart: true,
    next: []
  }
  const len = patternObjList.length
  start.next = getNext(patternObjList, -1)
  for (let i = 0; i < len; i++) {
    const curPattern = patternObjList[i]
    curPattern.next = getNext(patternObjList, i)
    if (collectionTypes.includes(curPattern.collectionType)) {
      curPattern.next.push(curPattern)
    }
  }
  return start
}

function getNext(patternObjList, index) {
  const next = []
  const len = patternObjList.length
  for (let i = index + 1; i < len; i++) {
    const nextPattern = patternObjList[i]
    next.push(nextPattern)
    if (nextPattern.collectionType !== '*') {
      break
    }
  }
  return next
}

function isMatch(str, generator) {
  if (generator.isStart) {
    for (const nextGen of generator.next) {
      if (isMatch(str, nextGen)) return true
    }
  } else if (generator.isEnd) {
    return str.length ? false : true
  } else {
    if (!str.length) {
      return false
    }
    if (!generator.pattern.includes(str[0])) {
      return false
    }
    const restStr = str.slice(1)
    for (const nextGen of generator.next) {
      if (isMatch(restStr, nextGen)) return true
    }
    return false
  }
}