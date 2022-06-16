'''
Author: water.li
Date: 2022-06-14 21:53:19
LastEditors: water.li
LastEditTime: 2022-06-16 21:38:37
FilePath: \note\Python\proxy_pool.py
'''

from urllib import request
from random import choice

url = 'http://www.baidu.com/s?wd=ip'

headers = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.67 Safari/537.36"
}

req = request.Request(url=url, headers=headers)

proxies_pools = [
  {'http': '118.24.36.127:1716'},
  {'http': '192.10.20.128:4331'},
  {'http': '17.29.199.233:2234'}
]
proxies = choice(proxies_pools)

# 获取handler对象
handler = request.PorxyHandler(proxies = proxies)

# 获取opener对象
opener = request.build_opener(handler)

# 调用open方法
res = opener.open(req)

content = res.read().decode('utf-8')

# 保存
with open('daili.html', 'w', encoding="utf-8") as fp:
  fp.write(content)
