// todo 全排列
/**
 * 输入一组不重复的数字，返回它们的全排列 
 * @param {array<number>} nums
 * @return {array<array<number>>}
 */
function permute(nums){
  let res = []

  function def(n, path) {
    for (let i = 0; i < n.length; i++) {
      // tracks 为已经遍历过的节点
      // noTracks 为当前没有遍历过的节点 
      let tracks = [...path, n[i]]
      let noTracks = [...n]
      noTracks.splice(i, 1)
      if (tracks.length === nums.length) res.push(tracks)
      if (noTracks.length > 0) def(noTracks, tracks)
    }
  }

  def(nums, [])
  return res
}

console.log(permute([1,2,3]))