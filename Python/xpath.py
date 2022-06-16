'''
Author: water.li
Date: 2022-06-16 21:39:14
LastEditors: water.li
LastEditTime: 2022-06-16 22:44:21
FilePath: \note\Python\xpath.py
'''
from lxml import etree

tree = etree.parse('本地文件.html')

li_list = tree.xpath('//ui/li[@id]/text()')

# 查找到id为l1标签的class的属性值
li = tree.xpath('//ui/li[@id="l1"]/@class')

'''
  1 路径查询
    // 查找所有子孙节点，不考虑层级关系
    /  查找所有子节点
  2 谓词查询
    //div[@id]
    //div[@id="maincontent"]
  3 属性查询
    //@class
  4 模糊查询
    // div[contains(@id, 'he')]
    // div[starts-with(@id, 'he')]
  5 内容查询  
    /text() 获取标签中的内容
  6 逻辑运算
    // div[@id="head" and @class="S_down"]
    // title | // price
'''

