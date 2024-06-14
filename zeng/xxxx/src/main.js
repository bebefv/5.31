import Vue from 'vue';
import App from './App.vue';
import VueRouter from 'vue-router';
import GoodsManagement from './components/GoodsManagement.vue'; // 确保引入商品管理组件

Vue.config.productionTip = false;
Vue.use(VueRouter);

const routes = [
  { path: '/', redirect: '/goods' },
  { path: '/goods', component: GoodsManagement },
  // 其他路由配置
];

const router = new VueRouter({
  routes
});

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');