const http = require('http')
const uuid = require('uuid')


const cardName = 'cut'
const session = {}

let server = http.createServer((req, res) => {
  res.setCookie = (key, value, options) {
    let opts = []
    if (options.domain) {
      opts.push(`domain=${options.domain}`)
    }
    // ... 
    arr.push(`${key}=${value}; ${opts.join('; ')}`)
    res.setHeader('Set-Cookie', arr)
  }
  res.getCookie = (key) => {
    const qs = querystring(req.headers.cookie, '; ')
    return qs[key]
  }
  if (req.url === '/cut') {
    let cardId = req.getCookie(cardName)
    if (cardId && session[cardId]) {
      session[cardId].mmny -= 10
      res.end('current money is'+session[cardId].mmny)
    } else {
      let cardId = uuid.v4()
      session[cardId] = {
        mmny: 100
      }
      res.setCookie(cardName, cardId)
      res.end('current money is')
    }
  }
})

server.listen(3000)