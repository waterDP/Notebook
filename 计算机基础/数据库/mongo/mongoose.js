const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/user', {useNewUrlParser: true}, err => {
  if (err) {
    return console.log(err)
  }
  console.log('数据库连接成功！')
})

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true  // ! 数据库保存值会去掉前后空格
  },
  age: Number,
  status: {
    type: Number,
    default: 1
  },
  param: {
    type: String,
    set(value) {
      return value  // !  这里就是数据库实际保存的值
    }
  }
})

UserSchema.statics.[methods] // todo 添加静态方法，this指向UserSchema

UserSchema.methods.[methods] // todo 添加实例方法, this指向

// 定义数据库模型
let UserModel = mongoose.model('User', UserSchema, [collection])

// todo 查询User表的数据
User.find({}, (err, doc) => {

})

// todo 增加数据
let u = new UserModel({
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

// todo 设置索引
const DeviceSchema = new mongoose.Schema({
  sn: {
    type: String,
    // ! 唯一索引
    unique: true
  },
  name: {
    type: String,
    // ! 普通索引
    index: true
  }
})