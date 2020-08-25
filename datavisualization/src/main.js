import Vue from 'vue'
import App from './App.vue'
import router from './router.js'
import Clair from '@clair/vue'
import * as CatChartsVue from 'cat-charts-vue'
import '@clair/theme-default/dist/index.css'

import './mock/mockPvuv.js'
import axios from 'axios'
import '../config/axios'

Vue.config.productionTip = false
Vue.use(Clair)
Vue.use(CatChartsVue)

// 将axios挂载到Vue实例,在组件中可以直接使用
Vue.prototype.$axios = axios

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
