import { createApp } from 'vue';
import { createStore } from 'vuex';
import App from './App.vue'
import router from './router'
import authModule from './store/auth';
import dashboard from './store/dashboard';
import budgetModule from './store/budget';
import transactionModule from './store/transaction';
import insight from './store/insight';
import Vue3Toastify from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const store = createStore({
    modules: {
        auth: authModule,
        budget: budgetModule,
        transaction: transactionModule,
        insight: insight,
        dashboard: dashboard,

    }
})

const app = createApp(App)
store.dispatch('restoreUser')
app.use(Vue3Toastify);

app.use(router).use(store).mount('#app')
