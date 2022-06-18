'''
Author: water.li
Date: 2022-06-18 13:37:13
LastEditors: water.li
LastEditTime: 2022-06-18 14:15:53
FilePath: \note\Python\selenium.py
'''
from selenium import webdriver

path = 'chromedriver.exe' # 浏览器驱动

browser = webdriver.Chrome(path)

url = "http://www.baidu.com"

browser.get(url)

# 元素定位

# 根据id来找到对象
button = browser.find_element_by_id('su')
# 根据标签属性的属性值来获取对象
button = browser.find_element_by_name('wd')
# 根据xpath语句来获取对象
button = browser.find_elements_by_xpath('//input[@id="su"]')
# 根据标签名字来获取对象
button = browser.find_element_by_tag_name('input')
# 使用bs4的语法来获取对象
button = browser.find_elements_by_css_selector('#su')
# 使用链接文本
button = browser.find_element_by_link_text('直播')