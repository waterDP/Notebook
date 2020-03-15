const express = require('express')

let app = express()

app.get('/', function(req, res, next) {
  res.end('home')
})

app.all('*', function(req, res) {
  res.end('*')
})

app.listen(3000)