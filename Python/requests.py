'''
Author: water.li
Date: 2022-06-18 14:49:54
LastEditors: water.li
LastEditTime: 2022-06-18 14:59:23
FilePath: \note\Python\requests_get.py
'''
import requests

url = 'http://www.baidu.com'

res = requests.get(url=url)

res.text # 网页的源码

res.encoding = 'utf-8'  # 设置响应的编码格式 

res.url  # 返回url 

res.content # 返回二进制的数据

res.status_code # 返回响应的状态码

res.headers # 返回响应头

