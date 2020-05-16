// todo 创建多级文件夹
function mkdir(p, cb) {
  let arr = p.split('/')
  let index = 0
  function next() {
    if (index === arr.length) cb()
    let current = arr.slice(0, ++index).join('/'); // 当前的路径
    fs.access(current, err => {
      if (err) { // 如果不存在就创建 
        fs.mkdir(current, next) 
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

// todo 同步创建
function mkdirSync(path) {
  let arr = path.split('/')
  for (let i = 0; i <arr.length; i++) {
    let p = arr.slice(0, i+1).join('/')
    try {
      fs.accessSync(p)
    } catch {
      fs.mkdirSync(p)
    }
  }
}

// todo 同步删除
function rmdirSync(p) {
  let dirs = fs.readdirSync(p)
  dirs = dirs.map(dir => path.join(p, dir))
  dirs.forEach(dir => {
    let statObj = fs.statSync(dir)
    if (statObj.isDirectory()) {
      fs.rmdirSync(dir)
    } else {
      fs.unlinkSync(dir)
    }
  })
  fs.rmdirSync(p)
}

// 异步 串行与并行
// todo 串行先序深度遍历
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
        next() // 切面
      })
    } else {
      fs.unlink(p, cb)
    }
  })
}

// Promise.all
// todo 并行先序深度优先
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

// async + await
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

rmdir('a').then(() => {
  console.log('删除成功！')
})

// todo  广度删除
function wideRmSync(p) {
  let arr = [p]
  let index = 0
  let current
  while(current = arr[index++]) {
    let statObj = fs.statSync(current)
    if (statObj.isDirectory()) {
      let dirs = fs.readdirSync(current).map(d => path.join(current, d))
      arr = [...arr, ...dirs]
    }
  }
  for (let i = arr.length - 1; i >= 0, i--) {
    let current = arr[i]
    let statObj = fs.statSync(current)
    if (statObj.isDirectory()) {
      fs.rmdirSync(current)
    } else {
      fs.unlinkSync(current)
    }
  }
}
