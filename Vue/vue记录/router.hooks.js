// 登录鉴权
const loginPermission = async function(to, from, next) {
  let r = await store.dispatch('xxx') // 发起是否登录过的验证
  let needLogin = to.matched.some(item => item.meta.needLogin)
  if (store.state.user.hasPermission) { // 没有登录
    if (needLogin) { // 此页面需要登录
      next('/login')
    } else { 
      next()
    }
  } else { // 登录过
    if (to.path === '/login') {
      next('/') // 去首页 
    } else {
      next()
    }
  }
  next()
}

// 路由权限的动态添加
const menuPermission = async function (to, from, next) {
  
}

export default {
  loginPermission
}