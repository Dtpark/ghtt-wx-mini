import Vue from 'vue'
import App from './App'
// import '../static/style/weui.css'
import login from '@/utils/handleLogin';
import wxAPI from '@/utils/wxAPI';
import url from '@/utils/config';
import index from '@/utils/index';
import '../static/style/weui.min.css';

Vue.config.productionTip = false
App.mpType = 'app'

Vue.prototype.$login = login; //手动登录的配置
Vue.prototype.$wxAPI = wxAPI; //封装的微信API的配置
Vue.prototype.$url = url; //域名的配置
Vue.prototype.$index = index; //常用函数的配置

const app = new Vue(App)
app.$mount()
