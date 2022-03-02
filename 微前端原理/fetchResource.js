/*
 * @Author: water.li
 * @Date: 2022-02-25 22:00:23
 * @Description: 
 * @FilePath: \notebook\微前端原理\fetchResource.js
 */
export default function(url) {
  return fetch(url).then(res => res.text())
}