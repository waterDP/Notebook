// todo Dijkstra 算法
// A的邻接矩阵如下
const graph = [
  [0, 2, 4, 0, 0, 0],
  [0, 0, 2, 4, 2, 0],
  [0, 0, 0, 0, 3, 0],
  [0, 0, 0, 0, 0, 2],
  [0, 0, 0, 0, 0, 0]
]

const INF = Number.MAX_SAFE_INTEGER

function minDistance(dist, visited) {
  let min = INF
  let minIndex = -1
  for (let v = 0; v < dist.length; v++) {
    if (visited[v] === false && dist[v] <= min) {
      min = dist[v]
      minIndex = v
    }
  }
  return minIndex
}

function dijkstra(graph, src) {
  const dist = []
  const visited = []
  const {length} = graph
  for (let i = 0; i < length; i++) { // 把所有的距离设置为无穷大
    dist[i] = INF
    visited[i] = false
  }
  dist[src] = 0 // 把源顶点到自己的距离设置为0
  for (let i = 0; i < length - 1; i++) { // 接下来，要找到其余顶点的最短路径
    const u = minDistance(dist, visited)
    visited[u] = true
    for (let v = 0; v < length; v++) {
      if (!visited[v] &&
        graph[u][v] !== 0 &&
        dist[u] !== INF &&
        dist[u] + graph[u][v] < dist[v]) {
          dist[v] = dist[u] + graph[u][v]
        }
    }
  }
  return dist
}

// todo Floyd 算法
