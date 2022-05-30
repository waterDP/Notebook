'''
Author: water.li
Date: 2022-05-30 19:19:49
LastEditors: water.li
LastEditTime: 2022-05-30 22:42:53
'''
from urllib import request, parse

data = {
  'wd': '周杰伦',
  'sex': '男'
}

new_data = parse.urlencode(data)

base_url = 'https//www.baidu.com/s?'

url = base_url + new_data

headers = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.67 Safari/537.36"
}

req = request.Request(url=url, headers=headers)

res = request.urlopen(req)

content = res.read().decode('utf8')

print(content)

