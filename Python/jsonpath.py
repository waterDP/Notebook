'''
Author: water.li
Date: 2022-06-16 23:30:43
LastEditors: water.li
LastEditTime: 2022-06-18 12:24:04
FilePath: \note\Python\jsonpath.py
'''
from jsonpath import jsonpath
import json

obj = json.load(open('./textie2.json', 'r', encoding="utf-8"))

# 书店下面的所有书的作者
auth_list = jsonpath(obj, '$.store.book[*].author')

# store 下面的所有的元素
tag_list = jsonpath(obj, '$.store.*')

# store 里面所有东西的prices
price_list = jsonpath(obj, '$.store..price')

# 第三本书
book = jsonpath(obj, '$..book[2]')

# 最后一本书
last_book = jsonpath(obj, '$..book[(@.length-1)]')