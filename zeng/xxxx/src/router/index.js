import Vue from 'vue';
import Router from 'vue-router';
import GoodsList from '@/components/GoodsList.vue';
import GoodsForm from '@/components/GoodsForm.vue';

Vue.use(Router);

const routes = [
  {
    path: '/',
    name: 'listItems',
    component: GoodsList
  },
  {
    path: '/add',
    name: 'addItem',
    component: GoodsForm
  },
  {
    path: '/edit/:id',
    name: 'editItem',
    component: GoodsForm
  }
];

const router = new Router({
  routes
});

export default router;
