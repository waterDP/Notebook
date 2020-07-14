  const path = require('path')
  const fs = require('fs')

  runLoaders({
    resource: path.resolve(__dirname, 'src', 'helle.js'), // 要加载的资源
    loaders: [  // 我们要用这三个loader
      path.resolve(__dirname, 'loader1'),
      // ...  
    ],
    context: {},//
    readResource: fs.readFileSync.bind(this)
  }, (err, result) => {
    console.log(result)
  })

  function createLoaderObject(loaderPath) {
    let obj = {data: {}} // data是用来在pitch和normal里传递数据的
    obj.request = loaderPath // loader文件绝对路径
    obj.normal = require(loaderPath)
    obj.pitch = obj.normal.pitch
    return obj
  }
  function defineProperty(loaderContext) {
    Object.defineProperty(loaderContext, 'request', {
      get() {
        return loaderContext.loaders
          .map(loader => loader.request)
          .concat(loaderContext.resource).join('!')
      }
    })

    Object.defineProperty(loaderContext, 'remindingRequest', {
      get() {
        return loaderContext.loaders
          .slice(loaderContext.loaderIndex+1)
          .map(loader => loader.request)
          .concat(loaderContext.resource).join('!')
      }
    })

    Object.defineProperty(loaderContext, 'previousRequest', {
      get() {
        return loaderContext.loaders
          .slice(0, loaderContext.loaderIndex+1)
          .map(loader => loader.request)
          .join('!')
      }
    })

    Object.defineProperty(loaderContext, 'currentRequest', {
      get() {
        return loaderContext.loaders
          .slice(loaderContext.loaderIndex, loaderContext.loaderIndex+1)
          .map(loader => loader.request)
          .concat(loaderContext.resource).join('!')
      }
    })

    Object.defineProperty(loaderContext, 'data', {
      get() {
        return loaderContext.loaders[loaderContext.loaderIndex].data
      }
    })
  }
  function processResource(loaderContext) {
    let result = loaderContext.readResource(loaderContext.resource)
    let currentLoader = loaderContext.loaders[loaderContext.loaderIndex]
    if (!currentLoader.normal.raw) {
      result = result.toString('utf8')
    }
    return result
  }
  function iterateNormalLoaders(loaderContext, args, finallyCallback, isAsync = false) {
    if (loaderContext.loaderIndex < 0) {
      finallyCallback(null, args)
    }
    let currentLoaderObject = loaderContext.loaders[loaderContext.loaderIndex]
    let normalFn = currentLoaderObject
    args = normalFn.apply(loaderContext, [...args])
    if (!isAsync) {
      loaderContext.loaderIndex--
      iterateNormalLoaders(loaderContext, args, finallyCallback)
    }
  }
  function iteratePitchingLoaders(loaderContext, finallyCallback) {
    if (loaderContext.loaderIndex >= loaderContext.loaders.length) {
      loaderContext.loaderIndex--
      let args = processResource(loaderContext)
      return iterateNormalLoaders(loaderContext, args, finallyCallback)
    }
    let currentLoaderObject = loaderContext.loaders[loaderContext.loaderIndex]
    let pitchFn = currentLoaderObject.pitch
    if (!pitchFn) {
      loaderContext.loaderIndex++
      return iteratePitchingLoader(loaderContext, finallyCallback)
    }

    const {remindingRequest, previousRequest, data} = loaderContext
    //  执行pitch
    let args = pitchFn.apply(loaderContext, [remindingRequest, previousRequest, data])

    if (args) {
      loaderContext.loaderIndex--
      return iteratorNormalLoaders(loaderContext, args, finallyCallback)
    }
    loaderContext.loaderIndex++
    return iteratePitchingLoader(loaderContext, finallyCallback)
  }

  function runLoaders(options, finallyCallback) {
    let loaderContext = options.context||{} // loader的上下文环境
    loaderContext.resource = options.resource // 要加载的资源 hello.js
    loaderContext.loaders = options.loaders.map(createLoaderObject)
    loaderContext.loaderIndex = 0 // loaderIndex指的是正在执行的loader的索引
    loaderContext.readSource = options.readSource // fs.readFile 
    defineProperty(loaderContext)

    function asyncCallback(err, result) {
      loaderContext.loaderIndex--
      iterateNormalLoaders(loaderContext, result, finallyContext, true)
    }

    loaderContext.async = function() {
      return asyncCallback
    }

    iteratePitchingLoaders(loaderContext, finallyCallback)
  }

