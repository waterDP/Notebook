# 一个简单的交互式循环
	while True:
		reply = input('Enter text:')
		if reply == 'stop': break
		print(reply.upper())

	# 这个程序利用了Python的while循环，它是Python最通用的循环语句。
	# python的break语句用于立即退出循环。也就是完全跳出循环语句而程序会继续循环之后的部分。
	

	while True:
		reply = input('Enter text:')
		if reply == 'stop': break
		print(int(reply) ** 2)
	print('Bye')

	# 处理错误（类型验证）
	while True:
		reply = input('Enter text:')
		if reply == 'stop':
			break
		elif not reply.isdigit():
			print("Bad!" * 8)	
		else:
			print(int(reply) ** 2)
	print('Bye')				

	# 用try语句处理错误
	while True:
		reply = input('Enter text:')
		if reply == 'stop': break
		try:
			num = int(reply) 
		except:
			print('Bad' * 8)	
		else: 
			print(int(reply) ** 2)	
	print('Bye')


	#嵌套代码三层
	while True:
		reply = input('Enter text:')
		if reply == 'stop':
			break
		elif not reply.isdigit():
			print('Bad!' * 8)	
		else: 
			num = int(reply)
			if num < 20:
				print('low')
			else:
				print(num ** 2)
	print('Bye')

# 字典处理分支语句
	branch = {
		'spam': 1.25,
		'ham': 1.99,
		'eggs': 0.99
	}

	print(branch.get('spam', 'Bad choice')) # 1.25
	print(branch.get('bacon', 'Bad choice')) # Bad choice

# 三元运算
	if X: 
		A = Y	
	else:
		A = Z

	# <=>		
	A = Y if X else Z

	