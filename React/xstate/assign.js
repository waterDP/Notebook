/*
 * @Author: water.li
 * @Date: 2024-09-30 17:12:09
 * @Description: 
 * @FilePath: \Notebook\React\xstate\assign.js
 */

function assign(assignment) {
  return {
    type: 'assign',
    assignment
  }
}

export default assign