from msilib.schema import Property

class Student:
  # 固定此类的属性
  __slots__ = ('name', 'age')
  # __xxx 表示私有属性
  def __init__(self, name, age):
    self.__name = name
    self.__age = age

  # 静态方法
  @staticmethod
  def is_valid(a, b, c):
    '''判断三条边长是否能构成三角形'''
    return a + b > c and b + c > a and a + c > b

  # 获取私有属性
  @Property
  def name(self):
    return self.__name
  
  @name.setter
  def name(self, name):
    self.__name = name or '无名'
  
  def study(self, course_name):
    print(f'学生{self.name}正在学习{course_name}')

  def play(self):
    print('学生正在玩游戏')

  def __repr__(self) -> str:
    return f'{self.name}: {self.__age}'


stu1 = Student('lhr', 12)
# python是支持动态类的  支持动态添加属性
stu1.sex = '男'
print(stu1)