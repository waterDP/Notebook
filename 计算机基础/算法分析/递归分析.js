// todo 记忆化斐波拉契列
function fibonacciMemoization(n) {
  const memo = [0, 1]
  const fibonacci = n => {
    if (memo[n] != null) return memo[n]
    return memo[n] = fibonacci(n - 1) + fibonacci(n - 2)
  }
  return fibonacci
}