
import { isObject } from './utils'
import { object } from './observableObject'

function observable(v) {
  if (isObject(v)) {
    return object(v)
  }
}
export default observable