const { createClient } = require('redis')

let client

/**
 * 初始化Redis客户端
 */
const redisClient = async () => {
  if (client) return

  client = createClient({
    url: 'redis://127.0.0.1:6379'
  })
    .on('error', err => console.log('Redis Client Error', err))
    .connect()
}

/**
 * 存入数组或对象，并可选地设置过期时间
 * @param key 键名
 * @param value 要存储的值
 * @param ttl 可选，以秒为单位的过期时间，默认不设置
 */
const setKey = async (key, value, ttl = null) => {
  if (!client) await redisClient()
  value = JSON.stringify(value)
  await client.set(key, value)

  // 如果设置了过期时间，则设置过期时间
  if (ttl) {
    await client.expire(key, ttl)
  }
}

/**
 * 读取数组或对象
 * @param key 键名
 * @returns {Promise<any>} 解析后的JSON对象或数组
 */
const getKey = async (key) => {
  if (!client) await redisClient()
  const value = await client.get(key)
  return value ? JSON.parse(value) : null
}

/**
 * 清除缓存数据
 * @param key
 * @returns {Promise<void>}
 */
const delKey = async (key) => {
  if (!client) await redisClient()
  await client.del(key)
}

module.exports = {
  redisClient,
  setKey,
  getKey,
  delKey
}