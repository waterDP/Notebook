'''
Author: water.li
Date: 2022-06-16 22:52:30
LastEditors: water.li
LastEditTime: 2022-06-16 23:25:12
FilePath: \note\station_source.py
'''

# 需求 下载的前十页的图片
# https://sc.chinaz.com/tupian/qinglvtupian.html
# https://sc.chinaz.com/tupian/qinglvtupian_page.html

from urllib import request
from lxml import etree

def create_request(page):
  if page == 1:
    url = 'https://sc.chinaz.com/tupian/qinglvtupian.html'
  else:
    url = 'https://sc.chinaz.com/tupian/qinglvtupian_' + str(page) +'.html'
  
  headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.67 Safari/537.36"
  }
  return request.Request(url=url, headers=headers)


def get_content(req):
  res = request.urlopen(req)
  return res.read().decode('utf-8')

def down_load(content):
  tree = etree.HTML(content)
  name_list = tree.xpath('//div[@id="container"]//a/img/@alt')
  src_list = tree.xpath('//div[@id="container"]//a/img/@src')
  for i in range(len(name_list)):
    name = name_list[i]
    src = src_list[i]
    url = 'https:' + src
    request.urlretrieve(url=url, filename=name+'.jpg')
  

if __name__ == '__main__':
  start_page = int(input('请输入起始页码'))
  end_page = int(input('请输入结束页码'))
  
  for page in range(start_page, end_page+1):
    req = create_request(page)
    content = get_content(req)
    down_load(content)
    