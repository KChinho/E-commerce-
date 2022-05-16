import Vue from 'vue';
import App from './App.vue';
import router from './router';

import './plugins/element.js';

import './assets/css/global.css';

import './assets/fonts/iconfont.css';

//引用 axios  并配置
import axios from 'axios'
//默认访问地址
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';
Vue.prototype.$http=axios;

axios.interceptors.request.use(config =>{
	config.headers.Authorization =window.sessionStorage.getItem('token')
	
	return config


})

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
