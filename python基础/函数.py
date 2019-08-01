#def语句
	# def <name>(arg1, arg2, ... argN):
		# <statements>

def times(x, y):
	return x * y

times(2, 4)  # 8

times('Ni', 4) # 'NiNiNiNi'


# 寻找定义的交集
	def intersect(seq1, seq2):
		res = []
		for x in seq1:
			if x in seq2:
				res.append(x)
		return res
	s1 = 'SPAM'	
	S2 = 'SCAM'
	intersect(s1, s2)
	#['S', 'A', 'M']
		
	[x for x in s1 if x in s2]					

# 作用域
	# Global scope
	X = 99            # X and func assigned in module: global 

	def func(Y):      # Y and Z assigned in function: locals
		# Local scope
		Z = X + Y       # X is global
		return Z

	func(1)

# global语句
	X = 88           # Global

	def func():
		global X
		X = 99         # Global X : outside def

	func()	
	print(X)         # Prints 99

# 工厂函数
	def maker(N):
		def action(X):
			return X ** N
		return action
		
	f = marker(2)
	f(3)   # 9
	f(4)   # 16

# 嵌套作用域和lambda
	def func():
		x = 4
		action = (lambda n: x ** n)
		return action

	x = func();
	print(x(2))   # 16  4 ** 2			 