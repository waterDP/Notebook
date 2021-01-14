// 定义奖金的访问者，在js中简单的用一个函数模拟，
// 如果在c#等强类型语言中，需要声明一个接口，不同的visitor实现不同的计算奖金方法，
// 比如下面的管理者和开发者奖金不一样
function bonusVisitor(employee: Employee) {
  if (employee instanceof Manager)
    employee.bonus = employee.salary * 2
  if (employee instanceof Developer)
    employee.bonus = employee.salary
}

// 定义员工类，注意继承此类的必须都带有accept这个接受visitor的方法，
// 就是用来接待访问者，进而内部用访问者调用自己方法实现一些操作，
// 此例中直接调用函数visitor(this)
class Employee {
  public bonus
  public salary
  
  constructor(salary) {
    this.bonus = 0
    this.salary = salary
  }

  accept(visitor) {
    visitor(this)
  }
}

// 管理者实现员工类
class Manager extends Employee {
  constructor(salary) {
    super(salary)
  }
}

// 开发者实现员工类
class Developer extends Employee {
  constructor(salary) {
    super(salary)
  }
}