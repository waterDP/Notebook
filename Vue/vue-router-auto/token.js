export function token (rc) {
  let allRouters = {}
  let routerFileAndLen = 
    rc.keys().map(fileName => {
      let realFileName = fileName.replace(/^\.\//, '').replace(/\.\w+$/, '')  // 掐掉开头与结尾
      return {
        fileName: realFileName,
        routerName: realFileName.replace(/\//g, '-').replace(/_/g, ''),
        routerComponent: fileName.substr(1),
        fileLen: fileName.match(/\//g).length  // fileLen(文件的层级深度)：通过 / 的数量来判断当前文件的深度
      }
    }).sort((i, j) => i.fileLen - j.fileLen)  // 通过文件深度升序排序
  
  let maxLen = 0

  routerFileAndLen.forEach(r => {
    let name = r.routerName
    let obj = {
      name,
      fileName: r.fileName,
      path: '/'+(name === 'index' ? '' : name),
      needDeleteName: false,
      component: () => {
        return Promise.resolve().then(() => {
          return require('@/' + rootFile + r.routerComponent)
        })
      }
    }
    maxLen = r.fileLen

    let key = 'len' + maxLen

    Array.isArray(allRouters[key])
      ? allRouters[key].push(obj)
      : allRouters[key] = [obj]
  })

  return {maxLen, allRouters}
}