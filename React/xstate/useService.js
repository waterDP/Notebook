import { useState } from "react"

function useService(service) {
  let [, forceUpdate] = useState(0)
  return [service.state, (event) => {
    service.send(event)
    forceUpdate(i => i + 1)
  }]
}

export default useService