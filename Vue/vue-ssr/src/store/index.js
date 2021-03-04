/*
 * @Description: 
 * @Date: 2021-03-04 10:10:19
 * @Author: water.li
 */
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default function() {
  let store = new Vue.Store({
    state: {
      username: 'water'
    },
    mutations: {
      set_username(state) {
        state.username = 'aaa'
      }
    },
    actions: {
      set_username({commit}) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            commit('username')
            resolve()
          }, 1000)
        })
      }
    }
  })
  if (window && window.__INITIAL_STATE__) {
    store.replaceState(window.__INITIAL_STATE__)
  }
  return store
}
