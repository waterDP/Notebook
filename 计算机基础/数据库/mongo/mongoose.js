const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/user')

const UserSchema = mongoose.Schema({
  name: String,
  age: Number,
  status: Number
})

// 定义数据库模型
let User = mongoose.model('User', UserSchema, [collection])

// todo 查询User表的数据
User.find({}, (err, doc) => {

})

// todo 增加数据
let u = new User({
  name: '',
  age: 20,
  status: 1
})

u.save(err => {})

// todo 更新数据
User.updateOne(
  {'_id': 'dfj3pubvf1345'},
  {name: 'hdfiweh'},
  (err, doc) => {}
)

// todo 删除数据
User.deleteOne({'_id': 'ifg4uiufv'}, (err, doc) => {})