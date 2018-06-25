import Vue from 'vue'
import Vuex from 'vuex'
import userInfo from '@/store/modules/user_info'
import store from '@/store/modules/store'

Vue.use(Vuex);
export default new  Vuex.Store({
    modules: {
        userInfo,
        store
    }
});
