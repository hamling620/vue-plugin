import Vue from 'vue'
import Vuex from './vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    firstName: 'hamling',
    number: 20
  },
  getters: {
    fullName (state) {
      return state.firstName + ' ' + 'Lu'
    }
  },
  mutations: {
    addSync (state, playload) {
      state.number += playload
    }
  },
  actions: {
    addAsync ({ commit }, playload) {
      setTimeout(() => {
        commit('addSync', playload)
      }, 2000)
    }
  },
  modules: {
    users: {
      state: {
        x: 1
      },
      modules: {
        username: {
          state: {
            name: 'lucile',
            age: 20
          }
        }
      }
    },
    teachers: {
      state: {
        y: 1
      }
    }
  }
})

export default store
