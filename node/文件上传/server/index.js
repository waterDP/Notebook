const app = require('./app')
const http = require('http')

const port = process.ENV.PORT || 8000
const server = http.createServer(app)

server.listen(port)
server.on('error', console.error)
server.on('listening', onListening)

function onListening() {
  console.log('Listening on ' + port)
}
