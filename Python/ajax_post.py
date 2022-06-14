'''
Author: water.li
Date: 2022-06-11 16:17:56
LastEditors: water.li
LastEditTime: 2022-06-11 21:47:41
FilePath: \note\Python\ajax_post.py
'''

# http://www.kfc.com.cn/kfccda/ashx/GetStoreList.ashx?op=cname

# cname: 北京
# pid: 
# pageIndex: 2
# pageSize: 10

from urllib import request, parse

from Python.ajax_get import down_load

def create_request(page):
  base_url = 'http://www.kfc.com.cn/kfccda/ashx/GetStoreList.ashx?op=cname'
  data = {
    'cname': '重庆',
    'pid': '',
    'pageIndex': page,
    'pageSize': 10
  }
  data = parse.urlencode(data).encode('utf-8')
  
  headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.67 Safari/537.36"
  }
  req = request.Request(url=base_url, headers=headers, data=data)

  return req

def get_content(req):
  res = request.urlopen(req)
  content = res.read().decode('utf-8')
  return content

def down_load(page, content):
  with open('kfc_'+str(page)+'.json', 'w', encoding='utf-8') as fp:
    fp.write(content)

if __name__ == '__main__':
  start_page = int(input('请输入起始页码'))
  end_page = int(input('请输入结束页码'))
  for page in range(start_page, end_page+1):
    req = create_request(page)
    content = get_content(req)
    down_load(page, content)