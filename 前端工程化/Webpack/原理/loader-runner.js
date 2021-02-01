/*
 * @Description: 
 * @Date: 2021-01-28 11:27:49
 * @Author: water.li
 */
const fs = require('fs')
const path = require('path')
const loader = require('./loaders/babel-loader')
const readFile = fs.readFile.bind(fs)
const PATH_QUERY_FRAGMENT_REGEXP = /^([^?#]*)(\?[^#]*)?(#.*)?$/

function parsePathQueryFragment(resource) {
  const result = PATH_QUERY_FRAGMENT_REGEXP.exec(resource)
  return {
    path: result[1],
    query: result[2],
    fragment: result[3]
  }
}
function convertArgs(args, raw) {
  if (raw && !Buffer.isBuffer(args[0])) {
    args[0] = Buffer.from(args[0], 'utf8')
  } else if (!raw && Buffer.isBuffer(args[0])) {
    args[0] = args[0].toString('utf8')
  }
} 
function createLoaderObject(loader) {
  let obj = {
    path: null,
    query: null,
    fragment: null,
    normal: null,
    pitch: null,
    raw: null,
    data: {},
    pitchExecuted: false,
    normalExecuted: false
  }
  Object.defineProperty(obj, 'request', {
    get() {
      return obj.path + obj.query + obj.fragment
    },
    set(v) {
      let splittedRequest = parsePathQueryFragment(v)
      obj.path = splittedRequest.path
      obj.query = splittedRequest.query
      obj.fragment = splittedRequest.fragment
    }
  })
  obj.request = loader
  return obj
}

function loadLoader(loaderObject) {
  let normal = require(loaderObject.path)
  loaderObject.normal = normal
  loaderObject.pitch = normal.pitch
  loaderObject.raw = normal.raw
}

function processResource(options, loaderContext, callback) {
  loaderContext.loaderIndex = loaderContext.loaders.length -1
  let resourcePath = loaderContext.resourcePath
  options.readResource(resourcePath, function(err, buffer) {
    if (err) return callback(error)
    options.resourceBuffer = buffer  // resourceBuffer放置的是资源的原始内容
    iterateNormalLoaders(options, loaderContext, [buffer], callback)
  })
}

function iterateNormalLoaders(options, loaderContext, args, callback) {
  // 如果正常的normalLoader全部执行完了
  if (loaderContext.loaderIndex < 0) {
    callback(null, args)
  }
  let currentLoaderObject = loaderContext.loaders[loaderContext.loaderIndex]
  if (currentLoaderObject.normalExecuted) {
    loaderContext.loaderIndex--
    return iterateNormalLoaders(optiond, loaderContext, args, callback)
  }
  let normalFn = currentLoaderObject.normal
  currentLoaderObject.normalExecuted = true
  convertArgs(args, currentLoaderObject.raw)
  runSyncOrAsync(normalFn, loaderContext, args, function(err) {
    if (err) callback(err)
    let args = Array.prototype.slice.call(arguments, 1)
    iterateNormalLoaders(options, loaderContext, args, callback)
  })
}

function iteratePitchingLoaders(options, loaderContext, callback) {
  if (loaderContext.loaderIndex >= loaderContext.loaders.length) {
    return processResource(options, loaderContext, callback)
  }
  let currentLoaderObject = loaderContext.loaders[loaderContext.loaderIndex]
  if (currentLoaderObject.pitchExecuted) {
    loaderContext.loaderIndex++
    return iteratePitchingLoaders(options, loaderContext, callback)
  }
  loadLoader(currentLoaderObject)
  let pitchFunction = currentLoaderObject.pitch
  if (!pitchFunction) {
    return iteratePitchingLoaders(options, loaderContext, callback)
  }
  runSyncOrAsync(
    pitchFunction, // 要执行的pitch函数
    loaderContext, // 上下文对象
    [loaderContext.remainingRequest, loaderContext.previousRequest, loaderContext.data = {}],
    function(err, args) {
      if (args) { // 如果args有值，说明这个pitch有返回值
        loaderContext.loaderIndex-- // 索引减1，开始回退了
        iterateNormalLoaders(options, loaderContext, args, callback)
      } else { // 如果没有返回值，则执行下一loader的pitch函数
        iteratePitchingLoaders(options, loaderContext, callback)
      }
    }
  )
}

function runSyncOrAsync(fn, context, args, callback) {
  let isSync = true // 默认是同步
  let isDone = false // 是否已完成，是否执行过此函数了，默认为 false
  // 调用context.async this.async 可以把同步变异步，表示这个loader里的代码是异步的
  context.async = function() {
    isSync = false
    return innerCallback
  }

  const innerCallback = context.callback = function() {
    isDone = true
    isSync = false
    callback.apply(null, arguments)
  }

  let result  = fn.apply(context, args)
  if (isSync) {
    isDone = true
    return callback(null, result)
  }
}

exports.runLoaders = function(options, callback) {
  let resource = options.resource || '' // 要加载资源的绝对路径
  let loaders = options.loaders || []
  let loaderContext = {}  // loader执行的上下文对象
  let readeSource = options.readSource || readFile // 此方法用于读取文件内容
  let splittedResource = parsePathQueryFragment(resource)
  let resourcePath = splittedResource.path
  let resourceQuery = splittedResource.query
  let resourceFragment = splittedResource.fragment
  let contextDirectory = path.dirname(resourcePath)
  // 准备loader对象数组
  loaders = loaders.map(createLoaderObject)
  // 要加载资源的所在目录
  loaderContext.context = contextDirectory
  loaderContext.loaderIndex = 0
  loaderContext.loaders = loaders
  loaderContext.resourcePath = resourcePath
  loaderContext.resourceQuery = resourceQuery
  loaderContext.resourceFragment = resourceFragment
  loaderContext.async = null
  loaderContext.callback = null
  Object.defineProperties(loaderContext, 'resource', {
    get() {
      return loaderContext.resourcePath + loaderContext.resourceQuery + loaderContext.resourceFragment
    }
  })
  Object.defineProperties(loaderContext, 'request', {
    get() {
      return loaderContext.loaders.map(l => l.request).concat(loaderContext.resource).join('!')
    }
  })
  Object.defineProperties(loaderContext, 'remainingRequest', {
    get() {
      return loaderContext.loaders.slice(loaderContext.loaderIndex + 1)
        .map(l => l.request).concat(loaderContext.resource).join('!')
    }
  })
  Object.defineProperties(loaderContext, 'currentRequest', {
    get() {
      return loaderContext.loaders.slice(loaderContext.loaderIndex)
        .map(l => l.request).concat(loaderContext.resource).join('!')
    }
  })
  Object.defineProperties(loaderContext, 'previousRequest', {
    get() {
      return loaderContext.loaders.splice(0, loaderContext.loaderIndex).map(l => l.request)
    }
  })
  // 当前loader的query
  Object.defineProperties(loaderContext, 'query', {
    get() {
      let loader = loaderContext.loaders[loaderContext.loaderIndex]
      return loader.options || loader.query
    }
  })
  // 当前loader的data
  Object.defineProperties(loaderContext, 'data', {
    get() {
      let loader = loaderContext.loaders[loaderContext.loaderIndex]
      return loader.data
    }
  })

  let processOptions = {
    resourceBuffer: null, // 最后会把执行结果的buffer放到这里
    readSource
  } 
  iteratePitchingLoaders(processOptions, loaderContext, function(err, result) {
    if (err) {
      return callback(err, {})
    }
    callback(null, {
      result,
      resourceBuffer: processOptions.resourceBuffer
    })
  })
}

