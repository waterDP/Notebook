'''
Author: water.li
Date: 2022-05-30 19:19:49
LastEditors: water.li
LastEditTime: 2022-05-30 22:42:47
'''
from urllib import request, parse
import json

url = 'https://fanyi.baidu.com/sug'

headers = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.67 Safari/537.36"
}

data = {
  'kw': 'spider'
}

# post请示参数 必须进行编码
data = parse.urlencode(data).encode('utf8')

req = request.Request(url=url, data=data, headers=headers)
res = request.urlopen(req)

content = res.read().decode('utf8')

obj = json.loads(content)

print(obj)