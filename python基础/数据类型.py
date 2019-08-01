# 数字
	>>> import math;
	>>> math.pi;
	>>> math.sqrt(85); # 9.21954445729

	>>> import random
	>>> random.random()  # 0.5689712545
	>>> random.choice([1, 2, 3, 4]) # 1


# 字符串
	>>> s = 'Spam'
	>>> len(s) # 4
	>>> s[0] # S
	>>> s[1] # p
	>>> s[-1] # m
	>>> s[-2] # a
	>>> s[len(s) - 1] # m
	# 值得注意的是，我们能够在方括号中使用任意表达式，而不仅仅是使用数字常量——只要Python需要一个值，我们可以使用一个常量、一个变量或任意表达式。Python的语法在这方面是完全通用的。

	# 除了简单地从位置进行，序列也支持一种所谓分片(slice)的操作，这是一种一步就能够提取整个分片(slice)的方法
	>>> s[1:3]  # pa
	>>> s[:3] # Spa
	>>> s[:-1] # Spa
	>>> s[:] # Spam
	# 加号合并或者重复
	>>> s + 'xyz' # Spamxyz  pure
	>>> s * 3 # SpamSpamSpam

	>>> s.find('pa')  # 1 (如果没有找到就返回-1)
	>>> s.replace('pa', 'XYZ') # SXYZm

	>>> line = 'aaa,bbb,ccc'
	>>> line.split(',') # ['aaa', 'bbb', 'ccc']
	>>> s = 'spam'
	>>> s.upper()  # 'SPAM'
	>>> s.isalpha()  # True

	# 字符串还支持一个叫做格式化的高级替代操作，可以以一个表达式的形式（最初的）和一个字符串方法调用(2.6 和 3.0中新引入的)形式使用
	>>> '%s, eggs, and %s' % ('spam', 'SPAM!')
	# 'spam, eggs and SPAM!'   Formatting expression (all)
	# 
	>> '{0}, eggs, and {1}'.format('spam', 'SPAM!')
	# 'spam, eggs and SPAM!'   Formatting expression (2.6 3.0)


# 列表
	>>> l = [123, 'spam', 1.23]
	>>> len(l) # 3
	>>> l[0] # 123
	>>> l[:-1] # [123, 'spam']
	>>> l + [4, 5, 6] # [123, 'spam', 1.23, 4, 5, 6] pure

	>>> l.append('NI')
	>>> l # [123, 'spam', 1.23, 'NI']
	>>> l.pop(2)  # 1.23
	>>> l # [123, 'spam', 'NI']
	# l.sort() l.reverse()
	# 
	>>> M = [[1, 2, 3],
					 [4, 5, 6],
					 [7, 8, 9]]
	>>> M #[[1, 2, 3], [4, 5, 6], [7, 8, 9]]
	>>> M[1] # [4, 5, 6]
	>>> M[1][1] # 5			

	#
	#	列表解析	 
	>>> col2 = [row[1] for row in M]
	>>> col2 # [2, 5, 8]

	>>> [row[1] + 1 for row in M]
	# [3, 6, 9]
	>>> [row[1] for row in M if row[1]%2 == 0]
	# [2, 8]
	# 
	>>> G = (sum(row) for row in M)
	>>> next(G)  # 6
	>>> next(G)  # 15

# 字典
	>>> D = {'food': 'Spam', 'quantity': 4, 'color': 'pink'}
	>>> D['food'] # 'Spam'
	>>> D['quantity'] += 1
	>>> D # {'food': 'Spam', 'color': 'pink', 'quantity': 5}

	>>> D = {}
	>>> D['name'] = 'Bob'
	>>> D['job'] = 'dev'
	>>> D['age'] = 40
	>>> D
	# {'age': 40, 'job': 'dev', 'name': 'Bob'}

	# 键的排序'
	>>> D = {'a': 1, 'c': 3, 'd': 2}
	>>> Ks = list(D.keys())
	>>> Ks  # ['a', 'c', 'b']

	>>> Ks.sort()
	>>> Ks # ['a', 'b', 'c']
	
	>>> for key in Ks:
				print(key, '=>', D[key])
	# a => 1
	# b => 2
	# c => 3
	# 
	for key in sorted(D):
		print(key, '=>', D[key])			

	# 不存在的键
	'f' in D  # False

	if not 'f' in D:
		print('missing')

	# 带有默认值的方式 
	>>> value = D.get('x', 0)				
	>>> value # 0

	>>> value = D['x'] if 'x' in D else 0
	>>> value # 0

# 元组
	>>> T = (1, 2, 3)
	>>> len(T)

	>>> T + (5, 6)
	# (1, 2, 3, 4, 5, 6)
	
	>>> T[0]
	# 1

	>>> T.index(4)  # 3  Tuple methods: 4 appears at offset 3
	>>> T.count(4)  # 1  4 appears once

	# 元组的真正的不同之处在于一旦创建后就不能再改变。也就是说，元组是不可变的序列
	>>> T[0] = 2
	#... error text omitted...
	# TypeError: 'tuple' object does not support item assignment
	# 


# 用户定义的类
	class Worker:
		def __init__(self, name, pay):  # Initialize when created
			self.name = name              # self is then new object
			self.pay = pay
		def lastName(self):            
			return self.name.split()[-1]  # Split string on blanks
		def giveRaise(self, percent):   
			self.pay *= (1.0 + percent)	  # Update pay in-place

	bob = Worker('Bob Smith', 5000)
	sue = Worker('Sue Jones', 6000)
	bob.lastName()
	# 'Smith'
	# ...
	sue.pay 

			