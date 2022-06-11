'''
Author: water.li
Date: 2022-06-11 15:15:38
LastEditors: water.li
LastEditTime: 2022-06-11 16:15:44
FilePath: \note\ajax_get.py
'''

# 下载豆瓣电影前10页
from urllib import request, parse

def create_request(page):
  base_url = 'https://movie.douban.com/j/chart/top_list?type=5'
  data = {
    'start': (page-1) * 20,
    'limit': 20
  }
  data = parse.urlencode(data)
  url = base_url + data
  print(url)
  headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.67 Safari/537.36"
  }
  req = request.Request(url=url, headers=headers)
  return req

def get_content(req):
  res = request.urlopen(req)
  content = res.read().decode('utf-8')
  return content

def down_load(content, page):
  with open('douban_'+str(page)+'.json', encoding='utf-8') as fp:
    fp.write(content)

# 程序的入口 
if __name__ == "__main__":
  start_page = int(input('请输入起始的页码'))
  end_page = int(input('请输入结束的页面'))
  
  for page in range(start_page, end_page+1):
    req = create_request(page)
    content = get_content(req)
    down_load(content, page)