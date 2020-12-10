import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    path: '',
    structure: {},
    breadcrumb: []
  },
  mutations: {
    updateHash (state) {
      const path = window.location.hash.substring(1) || ''
      const parts = path.split('/')
      const breadcrumb = []
      let slug = ''

      for (const item of parts) {
        slug += item
        breadcrumb.push({ name: item || 'home', path: slug })
        slug += '/'
      }

      state.path = path
      state.breadcrumb = breadcrumb
    },
    structure (state, payload) {
      state.structure[payload.path] = payload.data
    }
  },
  actions: {},
  modules: {}
})
