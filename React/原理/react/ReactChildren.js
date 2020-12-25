

function mapChildren(children, func, context) {
  if (children == null) return children
  const result = []
  mapIntoWithKeyPrefixInternal(children, result,  null, func, context)
}

function mapIntoWithKeyPrefixInternal(children, array, prefix, func, context) {
  let escapedPrefix = ''
  if (prefix != null) {
    escapedPrefix = escapeUserProvidedKey(prefix) + '/'
  }
  const traverseContext = getPooledTraverseContext(
    array,
    escapedPrefix,
    func,
    context
  )
  traverseAllChildren(children, mapSingleChildIntoContext, traverseContext)
  releaseTraverseContext(traverseContext)
}

const POOL_SIZE = 10
const traverseContextPool = []

function getPooledTraverseContext() {
  // args
  if (traverseContextPool.length) {
    const traverseContext = traverseContextPool.pop()
    // set attrs
    return traverseContext
  } else {
    /* attrs */
  }
}

function releaseTraverseContext(traverseContext) {
  // clear attrs
  if (traverseContextPool.length < POOL_SIZE) {
    traverseContextPool.push(traverseContext)
  }
}

function toArray(children) {
  return mapChildren(children, child => child) || []
}

function traverseAllChildren(children, callback, traverseContext) {
  if (children == null) return 0
  return traverseAllChildrenImpl(children, '', callback, traverseContext)
}

function traverseAllChildrenImpl(
  children,
  nameSoFar,
  callback,
  traverseContext 
) {
  const type = typeof children

  if (type === 'undefined' || type === 'boolean') {
    children = null
  }

  let invokeCallback = false

  if (children === null) {
    invokeCallback = true
  } else {
    switch (type) {
      case 'string':
      case 'number':
        invokeCallback = true
        break
      case 'object':
        switch (children.$$typeof) {
          case REACT_ELEMENT_TYPE:
          case REACT_PORTAL_TYPE:
            invokeCallback = true
        }  
    }
  }

  if (invokeCallback) {
    callback(
      traverseContext,
      children,
      nameSoFar === '' ? SEPARATOR + getComputedKey(children, 0) : nameSoFar
    )
  }

  let child, nextName, subtreeCount = 0
  const nextNamePrefix = nameSoFar === '' ? SEPARATOR : nameSoFar + SUBSEPARATOR 

  if (Array.isArray(children)) {
    for (let i = 0; i < children.length; i++) {
      child = children[i]
      nextName = nextNamePrefix + getComponentKey(child, i)
      subtreeCount += traverseAllChildrenImpl(
        child,
        nextName,
        callback,
        traverseContext
      )
    }
  } else {
    const iteratorFn = getIteratorFn(children)
    if (typeof iteratorFn === 'function') {
      // iterator 和 array差不多
    } else if (type === 'object') {
      // 提醒不正确的children类型
    }
  }

  return subtreeCount
}

function mapSingleChildIntoContext(bookKeeping, child, childKey) {
  const { result, keyPrefix, func, context } = bookKeeping

  let mappedChild = func.call(context, child, bookKeeping.count++)
  if (Array.isArray(mappedChild)) {
    mapIntoWithKeyPrefixInternal(mappedChild, result, childKey, c => c)
  } else if (mappedChild != null) {
    if (isValidElement(mappedChild)) {
      mappedChild = cloneAndReplaceKey(
        mappedChild,
        keyPrefix +
          (mappedChild.key && (!child || child.key !== mappedChild.key)
            ? escapeUserProvidedKey(mappedChild.key) + '/'
            : '') +
          childKey,
      )
    }
    result.push(mappedChild)
  }
}

export {
  forEachChildren as forEach,
  mapChildren as map,
  countChildren as count,
  onlyChild as only,
  toArray
}