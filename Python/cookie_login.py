'''
Author: water.li
Date: 2022-06-14 21:32:48
LastEditors: water.li
LastEditTime: 2022-06-14 21:48:47
FilePath: \note\Python\cookie_login.py
'''
# 适用场景：数据采集的时候 需要绕过登录 然后进入某个页面

# 什么情况下访问不成功 
# 因为请求头的信息不够，所以访问不成功 

from urllib import request

url = 'https://weibo.cn/4429495956/info'

headers = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.67 Safari/537.36",
  "Cookie": "twi=2929cabnvb3302oqossc",
  # 判断当前路由是不是由上一个路由进来的  防盗链
  "refer": 'https://weibo.cn/'
}

req = request.Request(url=url, headers=headers)

res = request.urlopen(req)
content = res.read().decode('utf-8')

with open('weibo.html', 'w', encoding='utf-8') as fp:
  fp.write(content)
