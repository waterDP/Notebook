/**
 * todo 爬楼梯
 * 假设你正在爬楼梯。需要n阶你才能到达楼顶，每次你可以爬1或2个台阶。你有多少种方法可以爬到楼顶
 */
function climbStairs(n) {
  const dp = []
  dp[0] = 0, dp[1] = 1, dp[2] = 2
  for (let i = 3; i <= n; i++) {
    dp[i] = dp[i-1] + dp[i-2]
  }
  return dp[n]
}

/**
 * todo 打家劫舍
 * 你是一个专业的小偷，计划偷窃沿街的房屋。每间房屋内藏有一定的现金，
 * 影响你偷窃的唯一制约因素就是相邻的房屋内装有一相互连通的防盗系统
 * 如果两间房屋在同一晚上被小偷闯入，系统就会自动报警
 * 给定一个代表每个房屋存放金额的非负整数数组，计算你在不触动警报装置的情况下，能够偷窃到的最大金额
 */
// ! 动态规划方程：dp[n] = Max(dp[n-1], dp[i-2]+nums[i])
// 由于不可以在相邻的房屋闯入，所以在当前位置n房屋可盗窃的最大值，要么就是n - 1房屋可盗窃的最大值，
// 要么就是n-2房屋可盗窃的最大值加上当前房屋的值，二者之间取最大值
function rob(nums) {
  if (nums.length === 0) return 0
  if (nums.length === 1) return nums[0]
  if (nums.length === 2) return Math.max(nums[0], nums[1])
  if (nums.length === 3) return Math.max(nums[0]+nums[2], nums[1])
  let dp = [nums[0], Math.max(nums[0], nums[1]), Math.max(nums[0] + nums[2], nums[1])]
  for (let i = 3; i < nums.length; i++) {
    dp[i] = Math.max(dp[i-1], dp[i-2]+nums[i])
  }
  return Math.max(dp[nums.length-1], dp[nums.length-2])
}

/** 
 * todo 零钱兑换
 * 给定不同面额的硬币coins和一个总全额amount。编写一个函数来计算可以凑成总金额所需的最少硬币个数
 * 如果没有任何一种硬币组合能组成总金额，返回-1 
 */
// dp[0] = 0 全额为零时不需要硬币
// dp[n] = min(dp[n], dp[n-coin1]+1, dp[n - coin2] + 1, ...) 金额为n时，硬币数等于(n-coin)+1中所需硬币最少的组合
function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity)
  dp[0] = 0
  for (let i = 1; i <amount; i++) {
    for (let coin of coins) {
      if (i - coin > 0) {
        dp[i] = Math.min(dp[i], dp[i-coin]+1)
      }
    }
  }
  return dp[amount] === Infinity ? -1: dp[amount]
}