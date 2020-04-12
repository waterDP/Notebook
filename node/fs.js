function mkdir(p, cb) {
  let arr = p.split('/')
  let index = 0
  function next() {
    if (index === arr.length) cb()
    let current = arr.slice(0, ++index).join('/'); // 当前的路径
    fs.stat(current, err => { // 如果有错误就有err
      if (err) {
        fs.mkdir(current, () => {
          next()
        })
      } else {
        next()
      }
    })  
  }
  next()
}

// 异步创建文件夹
mkdir('a/b/c/d', function() {
  console.log('异步创建成功')
})

// 异步 串行与并行
// 串行 先序深度遍历
function rmdir(p, cb) {
  // 判断是不是文件夹，如果不是，删除文件即可
  fs.stat(p, (err, statObj) => {
    if (statObj.isDirectory()) {
      fs.readdir(p, (err, dirs) => {
        dirs = dirs.map(dir => path.join(p, dir)) // [a/b, a/b/c]
        let index = 0
        function next() {
          if (index === dirs.length) {
            return fs.rmdir(p, cb)
          } 
          let current = dir[index++]
          rmdir(current, next)
        }
        next()
      })
    } else {
      fs.unlink(p, cb)
    }
  })
}

// Promise.all
// 并行先序深度优先
function rmdir(p, cb) {
  // 判断是不是文件夹，如果不是，删除文件即可
  fs.stat(p, (err, statObj) => {
    if (statObj.isDirectory()) {
      fs.readdir(p, (err, dirs) => {
        dirs = dirs.map(dir => path.join(p, dir)) // [a/b, a/b/c]
        // 先看有没有儿子 如果没有儿子直接删除即可
        if (dirs.length === 0) {
          return fs.rmdir(p, cb)
        }
        let index = 0
        function done() {
          index++
          if (index === dirs.length) { // 儿子删除完了就删除自己
            fs.rmdir(p, cb)
          }
        }
        // 有儿子就依次删除，并且删除后调用done方法
        for(let i = 0; i < dirs.length; i++) {
          let dir = dir[i]
          rmdir(dir, done)
        }
      })
    } else {
      fs.unlink(p, cb)
    }
  })
}

// Promise
function rmdir(p) {
  return new Promise((resolve, reject) => {
    fs.stat(p, function(err, statObj) {
      if (statObj.isDirectory()) {  // 先读取目录
        fs.readdir(p, function(err, dirs) {
          // 将目录 进行添加父路径
          dirs = dirs.map(d => rmdir(path.join(p,d)))
          // 删除子目录后，删除自己，如果没有儿子直接删除
          Promise.all(dirs).then(() => {
            fs.rmdir(p, resolve)
          })
        })
      } else {
        fs.unlink(p, resolve)
      }
    })
  })
}

// async
async function rmdir(p) {
  let statObj = await fs.stat(p)
  if (statObj.isDirectory()) {
    let dirs = await fs.readdir(p)
    dirs = dirs.map(d => rmdir(path.join(p, d)))
    await Promise.all(dirs)
    await fs.rmdir(p)
  } else {
    await fs.unlink(p)
  }
}

// 广度删除
function wideRmSync(dir) {
  let arr = []
  let index = 0
  let current
  while(current = arr[index++]) {
    let statObj = fs.statSync(current)
    if (statObj.isDirectory()) {
      let dirs = fs.readdirSync(current).map(d => path.join(current, d))
      arr = [...arr, ...dirs]
    }
  }
}