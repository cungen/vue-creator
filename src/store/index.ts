import Vue from 'vue'
import Vuex from 'vuex'
import drag from './modules/drag'
import designer from './modules/designer'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        drag,
        designer
    }
})
