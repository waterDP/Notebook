const mockJS = require('mockjs')

const userList = mockJS.mock({
  "data|100": [{
    name: "@cname",
    ename: "@name",
    "id|+1": 1,
  }]
})

console.log(userList)

module.exports = [
  {
    method: 'post',
    url: '/user/list',
    response({ body }) {
      return {
        code: 200,
        data: userList.data,
        msg: 'success'
      }
    }
  }
]