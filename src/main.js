import Vue from 'vue'
import App from './App.vue'
import router from './router'

import Vant,{Lazyload} from 'vant';
// options 为可选参数，无则不传
Vue.use(Lazyload);
Vue.use(Vant);

Vue.config.productionTip = false
Vue.prototype.$bus = new Vue()


new Vue({
  render: h => h(App),
  router
}).$mount('#app')
