import Budget from '@/views/dashboard/Budget.vue';
import DashboardHome from '@/views/dashboard/Dashboard.vue';
import Insight from '@/views/dashboard/Insight.vue';
import Transaction from '@/views/dashboard/Transaction.vue';
import Login from '@/views/Login.vue'
import Signin from '@/views/Signup.vue';
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {path: '/', redirect: '/login' },
  { path: '/login', name: 'Login', component: Login },
  { path: '/signup', name: 'Signin', component: Signin },
  { path: '/dashboard',
    redirect: '/dashboard/budget',
    name: 'DashboardHome',
    component: DashboardHome,
    meta: { requiresAuth: true },
    children: [
      {
        path: '/dashboard/budget',
        component: Budget,
      },
      {
        path: '/dashboard/transaction',
        component: Transaction,
      },
      {
        path: '/dashboard/financial-insight',
        component: Insight,
      },
    ]
   },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('authToken');
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});


export default router;
