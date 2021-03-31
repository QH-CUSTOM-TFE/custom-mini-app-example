import Vue from 'vue'
import App from './App.vue'
import { bootstrap } from "@/core";

Vue.config.productionTip = false

bootstrap().then(() => {
  new Vue({
    render: h => h(App),
  }).$mount('#app')
});

