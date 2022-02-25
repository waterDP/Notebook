/*
 * @Author: water.li
 * @Date: 2022-02-25 19:44:55
 * @Description: mapStore vuex 映射 
 * @FilePath: \notebook\Vue\vue记录\mapStore.js
 */
import {createNamespaceHelpers} from "vuex"
export default function(namespace) {
  const {
    mapState,
    mapMutations,
    mapActions,
    mapGetters
  } = createNamespaceHelpers(namespace)
  return (states = [], mutations = [], actions = [], getters = []) => ({
    computed: {
      ...mapState(states),
      ...mapGetters(getters)
    },
    methods: {
      ...mapMutations(mutations),
      ...mapActions(actions)
    }
  })
}
