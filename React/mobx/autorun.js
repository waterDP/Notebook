/*
 * @Author: water.li
 * @Date: 2022-08-03 20:09:05
 * @Description: 
 * @FilePath: \note\React\mobx\autorun.js
 */
import { getNextId } from './utils'
import Reaction from './reaction'

/**
 * @param {function} view
 */
function autorun(view) {
  const name = `Autorun@${getNextId()}`
  const reaction = new Reaction(
    name,
    function() {
      this.track(view)
    }
  )
  reaction.schedule()
}

export default autorun