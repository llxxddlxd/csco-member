import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
//import './assets/theme/theme-green/index.css'
import VueRouter from 'vue-router'
import store from './vuex/store'
import Vuex from 'vuex'
//import NProgress from 'nprogress'
//import 'nprogress/nprogress.css'
import routes from './routes'
// import Mock from './mock'
// Mock.bootstrap();
import 'font-awesome/css/font-awesome.min.css'

Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)

//NProgress.configure({ showSpinner: false });

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  //NProgress.start();
  // if (to.path == '/login') {
  //   sessionStorage.removeItem('user');
  // }
  // let user = JSON.parse(sessionStorage.getItem('user'));
  // if (!user && to.path != '/login') {
    // next({ path: '/login' })
  // } else {
    next()
  // }
})

//默认返回yyyy-MM-dd HH-mm-ss
Vue.prototype.dateFormatter = function (str,type=''){
    if(!str){
      return '';
    }
    
    var hasTime = arguments[1] != false ? true : false;//可传第二个参数false，返回yyyy-MM-dd
    var d = new Date(str);
    var year = d.getFullYear();
    var month = (d.getMonth()+1)<10 ? '0'+(d.getMonth()+1) : (d.getMonth()+1);
    var day = d.getDate()<10 ? '0'+d.getDate() : d.getDate();
    var hour = d.getHours()<10 ? '0'+d.getHours() : d.getHours();
    var minute = d.getMinutes()<10 ? '0'+d.getMinutes() : d.getMinutes();
    var second = d.getSeconds()<10 ? '0'+d.getSeconds() : d.getSeconds();
    if(type=='year'){
        return [year].join('-');
    }else if(type=='month'){
        return [year, month].join('-');
    }
    else{
        return [year, month, day].join('-') + " " + [hour, minute, second].join(':');

    }
}
 
// import VueJsonp from 'vue-jsonp'
// Vue.use(VueJsonp)

//router.afterEach(transition => {
//NProgress.done();
//});

new Vue({
  //el: '#app',
  //template: '<App/>',
  router,
  store,
  //components: { App }
  render: h => h(App)
}).$mount('#app')

