/**
 * @description: 编译生成路径
 * @param {array} allRouters
 * @return {array}
 */ 
export function parse(allRouters) {
  let result = []
  result.push(allRouters.len1)
  for (let i = maxLen; i > 1; i--) {
    createRouter(i, null, null, result, allRouters)
  }
  deleteName(result)
  return result
}

/**
 * 路由成生
 * @param {number} deep 当前文件的深度
 * @param {number} noFindCount 未找到路由的次数 
 * @param {number} currentDeepCount 当前深度下路由次数
 * @param {array} parent 容器即为最后的返回结果
 * @param allRouters
 */
function createRouter(deep, noFindCount = 0, currentDeepCount = null, parent, allRouters) {
  let current = currentDeepCount || allRouters['len' + deep]
  let previous = allRouters['len' + (deep - 1)]

  if (!previous) {
    current.forEach(r => {
      let path = '/' + r.fileName.replace('/index', '')
      path.match('_') && (path = path.replace('/_', '/:'))
      r.path = path
      parent.push(r)
    })
    return
  }

  const noFind = []
  current.forEach(r => {
    let findObject = previous.find(p => {
      let name = substrName(r.name)
      for (let i = 0; i < noFindCount; i++) {
        name = substrName(name)
      }
      return name === p.name
    })
    if (findObject) {
      let path = r.fileName
        .replace(findObject.fileName, '')
        .substr(1)
        .replace('_', ':')
      if (path.match('/') && !path.match('/:')) {
        path = path.replace('/index', '')
      }
      if (path === undefined) {
        throw new Error('路径匹配错误')
      }
      r.path = path
      if (path === 'index') {
        r.path = ''
        findObject.needDeleteName = findObject.needDeleteName || true
      }
      // 将当前路由放到时父路由的children里面
      Array.isArray(findObject.children)
        ? findObject.children.push(r)
        : findObject.children = [r]
    } else {
      noFind(r)
    }
  })

  noFind.length && createRouter(deep - 1, ++noFindCount, currentDeepCount, parent, allRouters)
}

// 截取名称方法：从开始到最后一个'-'之间的字符串
function substrName(name) {
  return name.substr(0, name.lastIndexOf('-'))
}

function deleteName(arr) {
  arr.forEach(r => {
    delete r.fileName
    r.needDeleteName && (delete r.name)
    delete r.needDeleteName
    Array.isArray(r.children) && deleteName(r.children)
  })
}

