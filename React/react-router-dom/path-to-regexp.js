export function tokensToRegexp(tokens, keys, options) {
  const {
    strict = false,
    start = true,
    end = true,
    encode = x => x
  } = options

  const endsWith = `[${escapeString(options.endsWith || "")}]|$`
  const delimiter = `[${escapeString(options.delimiter || "/#?")}]`
  let route = start ? '^' : ''

  // todo 迭代tokens流，生成正则表达式
  for (const token of tokens) {
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      const prefix = escapeString(encode(token.prefix))
      const suffix = escapeString(encode(token.suffix))

      if (token.pattern) {
        if (keys) keys.push(token)

        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            const mod = token.modifier === "*" ? "?" : ""
            route += `(?:${prefix}((?:${token.pattern})(?:${suffix}${prefix}(?:${token.pattern}))*)${suffix})${mod}`
          } else {
            route += `(?:${prefix}(${token.pattern})${suffix})${token.modifier}`
          }
        } else {
          route += `(${token.pattern})${token.modifier}`
        }
      } else {
        route += `(?:${prefix}${suffix})${token.modifier}`
      }
    }
  }

  if (end) {
    strict && (route += `${delimiter}?`)
    route += !options.endsWith ? '$' : `(?=${endsWith})`
  } else {
    const endToken = tokens[tokens.length - 1]
    const isEndDelimited =
      typeof endToken === 'string'
      ? delimiter.indexOf(endToken[endToken.length - 1]) > -1
      : endToken === undefined

    strict && (route += `(?:${delimiter}(?=${endsWith}))?`)
    isEndDelimited && (route += `(?=${delimiter}|${endsWith})`)
  }

  return new RegExp(route, flags(options))
}

function flags(options) {
  return options && options.sensitive ? '' : 'i'
}

function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, '\\$1')
}

/**
 * 编译
 */
function parse(str, options) {
  const tokens = lexer(str)
  const {prefixes = './'} = options
  const defaultPattern = `[^${escapeString(options.delimiter || "/#?")}]+?`
  const result = []

  let key = 0, i = 0, path = ''

  const tryConsumer = type => {
    if (i < tokens.length && tokens[i].type === type) {
      return tokens[i++].value
    }
  }

  const mustConsumer = type => {
    const value = tryConsumer(type)
    if (value !== undefined) return value
    const {type, index} = tokens[i] 
    throw new TypeError(`Unexpected ${nextType} at ${index}, expected ${type}`)
  }

  const consumerText = () => {
    let result = ''
    let value
    while((value = tryConsumer('CHAR') || tryConsumer('ESCAPED_CHAR'))) {
      result += value
    }

    return result
  }

  while (i < tokens.length) {
    const char = tryConsumer('CHAR')
    const name = tryConsumer('NAME')
    const patter = tryConsumer('PATTERN')

    if (name || pattern) {
      let prefix = char || ''

      if (prefixes.indexOf(prefix) === -1) {
        path += prefix
        prefix = ''
      }

      if (path) {
        result.push(path)
        path = ''
      }
      
      result.push({
        name: name || key++,
        prefix,
        suffix: '',
        pattern: patter || defaultPattern,
        modifier: tryConsumer('MODIFIER') || ''
      })
      continue
    }

    const value = char || tryConsumer('ESCAPED_CHAR')
    if (value) {
      path += value
      continue
    }

    if (path) {
      result.push(path)
      path = ''
    }

    const open = tryConsumer('OPEN')
    if (open) {
      const prefix = consumerText()
      const name = tryConsumer('NAME') || ''
      const pattern = tryConsumer('PATTERN') |''
      const suffix = consumerText()

      result.push({
        name: name || (pattern ? key++ : ''),
        pattern: name && !pattern ? defaultPattern : pattern,
        prefix,
        suffix,
        modifier: tryConsumer('MODIFIER') || ''
      })

      continue
    }

    mustConsumer('END')
  }

  return result
}

/**
 * 分词
 * @param {string} str
 * @return {array} tokens
 */
function lexer(str) {
  const tokens = []
  let i = 0

  while(i < str.length) {
    const char = str[i]

    if (char === '*' || char === '+' || char === '?') {
      tokens.push({type: 'MODIFIER', index: i, value: str[i++]})
      continue // 下一轮
    }

    if (char === '\\') {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] })
      continue
    }

    if (char === '{') {
      tokens.push({ type: "OPEN", index: i, value: str[i++] })
      continue
    }

    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] })
      continue
    }

    if (char === ':') {
      let name = ''
      let j = i + 1
      while (j < str.length) {
        const code = str.charCodeAt(j)

        if (
          // `0-9`
          (code >= 48 && code <= 57) ||
          // `A-Z`
          (code >= 65 && code <= 90) ||
          // `a-z`
          (code >= 97 && code <= 122) ||
          // `_`
          code === 95
        ) {
          name += str[j++]
          continue
        }

        break
      }

      if (!name) throw new TypeError(`Missing parameter name at ${i}`) 

      tokens.push({ type: "NAME", index: i, value: name })
      i = j
      continue
    }

    if (char === "(") {
      let count = 1
      let pattern = ""
      let j = i + 1

      if (str[j] === "?") {
        throw new TypeError(`Pattern cannot start with "?" at ${j}`)
      }

      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++]
          continue
        }

        if (str[j] === ")") {
          count--
          if (count === 0) {
            j++
            break
          }
        } else if (str[j] === "(") {
          count++;
          if (str[j + 1] !== "?") {
            throw new TypeError(`Capturing groups are not allowed at ${j}`)
          }
        }

        pattern += str[j++]
      }

      if (count) throw new TypeError(`Unbalanced pattern at ${i}`)
      if (!pattern) throw new TypeError(`Missing pattern at ${i}`)

      tokens.push({ type: "PATTERN", index: i, value: pattern })
      i = j
      continue
    }
  }

  tokens.push({type: 'END', index: i, value: ''})
  return tokens
}

function regexpToRegexp(path, keys) {
  if (!keys) return path;

  const groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g

  let index = 0
  let execResult = groupsRegex.exec(path.source)

  while (execResult) {
    keys.push({
      name: execResult[1] || index++,
      prefix: '',
      suffix: '',
      modifier: '',
      pattern: ''
    })
    
    execResult = groupsRegex.exec(path.source)
  }

  return path
}

function arrayToRegexp(path, keys, options) {
  const parts = path.map(path => pathToRegexp(path, keys, options).source)
  return new RegExp(`(?:${parts.join("|")})`, flags(options))
}

function stringToRegexp(path, keys, options) {
  return tokensToRegexp(parse(path, options), keys, options)
}

export function pathToRegexp(path, keys, options) {
  if (path instanceof RegExp) return regexpToRegexp(path, keys)
  if (Array.isArray(path)) return arrayToRegexp(paths, keys, options)
  return stringToRegexp(path, keys, options)
}