import Vue from 'vue'
import Vuex from 'vuex'
import urls from './modules/urls'
import images from './modules/images'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
    },
    mutations: {
    },
    actions: {
    },
    getters: {
    },
    modules: {
        urls,
        images
    }
})
