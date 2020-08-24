import Vue from 'vue'
import App from './App.vue'
import router from './router.js'
import Clair from '@clair/vue'
import * as CatChartsVue from 'cat-charts-vue'
import '@clair/theme-default/dist/index.css'

Vue.config.productionTip = false
Vue.use(Clair)
Vue.use(CatChartsVue)


new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
