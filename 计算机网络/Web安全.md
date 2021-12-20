<!--
 * @Author: water.li
 * @Date: 2021-09-29 22:34:31
 * @Description: 
 * @FilePath: \notebook\计算机网络\Web安全.md
-->
# 1. XSS（跨站脚本攻击）Cross-Site Scripting

## xss 分类
### 反射型

发出请求时，XSS代码出现在URL中，作为输入提交到服务端，服务端解析后响应，在响应内容出现这段XSS代码，最后浏览器解析执行。
这个过种就像反射一次反射，故做为反射型XSS

### 持久型/存储型

存储型XSS和反射型XSS差别仅在于：提交的XSS代码会存储在服务端（不管是数据库，内存还是文件系统等），下次请求目标页面不用再
提交XSS代码。

httponly此属性可以防止XSS它会禁止javascript脚本来访问cookie
secure属性告诉浏览器仅在请求为https的时候发送cookie

### DOM-Based 

不基于后端

encodeURIComponent(data) 转义路径查询
encodeURI() 转义地址

```html
  <img src='errorUrl' onerror='alert(1)'>
```
## XSS 防范
1.CSP （内容安全策略）Content Security Policy
Content-Security-Policy: default-src 'self' // 只允许加载本站资源
Content-Security-Policy: img-src https:// 只允许加载https协议图片
Content-Security-Policy: child-src 'none' //不允许加载任何来源的
框架

ctx.set("Content-Security-Policy", "default-src 'self'")

2.转义(黑名单)
```javascript
  function excape(str) {
    str = sts.replace(/&/g, '&amg;')
             .replace(/</g, '&lt;')
             .replace(/>/g, '&gt;')
             .replace(/"/g, '&quto;')
             .replace(/'/g, '&#39;')
             .replace(/`/g, '&#96;')
             .replace(/\//g, '&#x2F;')
    return str
  }
```

（白名单）富文本处理
```js
  const xss = require('xss')
  let html = xss("<h1>Xss</h1><script>alert('xss')</script>")
```
3.HttpOnly 防止cookie被盗取

## 2. CSRF

CSRF/XSRF (跨站请求伪造) Cross Site Request Forgery
一般是攻击者冒充用户进行站内操作，它与XSS非常不同，XSS利用站点内的信任用户，而CSRF则是伪装成受信任用户的请求来访问操作受信任的网站

CSRF攻击都依赖下面的假定
1.攻击者了解受害者所在的站点
2.攻击者的目标站点具有持久化授权cookie或者受害者具有当前会话cookie
3.目标站点没有对用户在网站行为的第二授权
4.欺骗用户的浏览发送http请求给目标站点（也就是忽悠用户点击攻击链接）或者攻击者控制部分或全部站点（比如攻击者通过xss拿到未失效的经过网站授权的cookie）

### 防范

1.添加验证码
2.判断来源 referer 可以通过node请求来伪造(可以被篡改)
3.token

## 3. 点击劫持 Click Jacking
  点击劫持是一种视觉欺骗的攻击手段。攻击者将需要攻击的网站通过iframe嵌套的方式嵌入自己的页面中，并将iframe设置为透明，在页面中透出一个按钮言为诱导用户点击

### 防范
  X-FRAME-OPTIONS是一个http响应头，在现代浏览器有一个很好的支持。这个HTTP响应头就是为了防御有iframe嵌套的点击支持攻击
    该响应头有三个值可选，分别是
    DENY，表示页面不允许通过iframe的方式展示
    SAMEORIGIN, 表示页面可以在指定的相同域名下通过iframe的方法展示
    ALLOW-FROM, 表示页面可以在指定来源的iframe中展示

