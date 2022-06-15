'''
Author: water.li
Date: 2022-06-14 21:53:19
LastEditors: water.li
LastEditTime: 2022-06-14 22:04:11
FilePath: \note\Python\proxy.py
'''

from urllib import request

url = 'http://www.baidu.com/s?wd=ip'

headers = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.67 Safari/537.36"
}

req = request.Request(url=url, headers=headers)

# 获取handler对象 
handler = request.HTTPHandler()

# 获取opener对象
opener = request.build_opener(handler)

# 调用open方法
res = opener.open(req)

content = res.read().decode('utf-8')

print(content)

