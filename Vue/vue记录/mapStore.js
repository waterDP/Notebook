/*
 * @Author: water.li
 * @Date: 2022-02-25 19:44:55
 * @Description: mapStore vuex 映射 
 * @FilePath: \note\Vue\vue记录\mapStore.js
 */
import { createNamespaceHelpers, mapState, mapMutations, mapActions, mapGetters } from "vuex"
export default function (namespace) {
  if (namespace) {
    return mapFactory(createNamespaceHelpers(namespace))
  }
  return mapFactory({ mapState, mapMutations, mapActions, mapGetters})
}

function mapFactory({ mapState, mapMutations, mapActions, mapGetters }) {
  return function (states = [], mutations = [], actions = [], getters = []) {
    return {
      computed: {
        ...mapState(states),
        ...mapGetters(getters)
      },
      methods: {
        ...mapMutations(mutations),
        ...mapActions(actions)
      }
    }
  }
}
