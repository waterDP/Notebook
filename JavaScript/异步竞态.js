// todo 解决方案 Thunks
function getFile(file) {
  let resp  // 这个值可能是回调函数，也可能是回调函数中的要传入的参数

  ajax(file, text => {
    if (resp) {
      resp(text)
    } else {
      resp = text
    }
  })

  return function thunk(cb) {
    if (resp) {
      cb(resp)
    } else {
      resp = cb
    }
  }
}

/** 
 * 注意我们如上有一个很有趣的实现，实际上在调用getFile函数的时候，内部就已经发生了ajax请求（
 * 因此请求并没有被阻塞），但是真正返回响应的逻辑放在了thunk中 
 */
// 业务逻辑如下
let thunk1 = getFile('file1')
let thunk2 = getFile('file2')
let thunk3 = getFile('file3')

thunk1(text => {
  console.log(text)
  thunk2(text => {
    console.log(text)
    thunk3(text => {
      console.log(text)
      console.log('complete')
    })
  })
})

// 这样写不能避免回调地狱

// todo 解决方案 中间件
/* compose函数，简化了中间件的实现过程 */
function compose(...mdws) {
  return () => {
    function next() {
      const mdw = mdws.shift()
      mdw && mdw(next)
    }
    mdws.shift()(next)
  }
}
// 那我们的getFile函数实现也得稍微的修改一下，让返回的thunk函数可以交由中间件的next控制
function getFileMiddleware(file, cb) {
  let resp
  
  ajax(file, text => {
    if (resp) {
      resp(text)
    } else {
      resp = text
    }
  })

  return next => {
    const _next = args => {
      cb && cb(args)
      next(args)
    }   
    if (resp) {
      _next(resp)
    } else {
      resp = _next
    }
  }
}

// 基于上面的两个实现 ，我们最终的写法可以用这种方式来实现
const middlewares = [
  getFileMiddleware('file1', console.log),
  getFileMiddleware('file2', console.log),
  getFileMiddleware('file3', resp => {
    console.log(resp)
    console.log('Complete')
  })
]
compose(middlewares)()

// todo 解决方案 Promises
const p1 = getFile("file1");
const p2 = getFile("file2");
const p3 = getFile("file3");
const constant = v => () => v;

p1.then(output)
  .then(constant(p2))
  .then(output)
  .then(constant(p3))
  .then(output)
  .then(() => {
    output("Complete!");
  });

// 改进
const urls = ["file1", "file2", "file3"];
const getFilePromises = urls.map(getFile);
const constant = v => () => v;

getFilePromises
  .concat(Promise.resolve("Complete!"), Promise.resolve())
  .reduce((chain, filePromise) => {
    return chain.then(output).then(constant(filePromise));
  })

// todo 解决方案 async/await
function getFile(file) {
  return new Promise(resolve => {
    ajax(file,resolve)
  })
}
async function loadFiles(urls) {
  const getFilePromises = urls.map(getFile)
  do {
    const res = await getFilePromises.shift()
    console.log(res)
  } while (getFiles.length)
  console.log('complete')
}
loadFiles(['file1', 'file2', 'file3'])