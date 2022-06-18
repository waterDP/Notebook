'''
Author: water.li
Date: 2022-06-18 12:35:24
LastEditors: water.li
LastEditTime: 2022-06-18 13:18:05
FilePath: \note\Python\bs4.py
'''
from bs4 import BeautifulSoup

soup = BeautifulSoup(open('someone.html', encoding='utf-8'), 'lxml')

# 根据标签名查找节点
# 找到第一个符合条件的数据
print(soup.a)
print(soup.a.attrs) # 标签的属性

# bs4的一些函数
# 1. find
# 返回第一个符合条件的数据
print(soup.find('a'))
# 根据title的值来找到相应的对象 
print(soup.find('a', title="a2"))
# 根据class的值来找到对应标签对象，注意的是class需要添加下划线
print(soup.find('a', class_='a1'))
# 2. find_all
print(soup.findall(['a', 'span']))
print(soup.find_all('li', limit=2))
# 3. select(推荐)
print(soup.select('a'))

print(soup.select('.a1')) # class为a1的元素 
print(soup.select('#a2'))
