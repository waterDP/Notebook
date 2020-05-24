const express = require('express')

// 通过express执行产生一个应用 
let app = express()

app.get('/', (req, res) => { // req, res 是原生的node中的req和res
  res.end('ok')
})
app.get('/hello', (req, res) => {
  res.end('hello')
})

app.use(function(req, res, next) {
  console.log(1)
  req.a = 1
  next
})

app.use('/a', function(req, res) {
  req.a++
  next() 
})

app.listen(3000)