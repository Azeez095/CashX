import { createApp } from 'vue';
import { createStore } from 'vuex';
import App from './App.vue'
import router from './router'
import authModule from './store/auth';
import budgetModule from './store/budget';
import transactionModule from './store/transaction';
import insight from './store/insight';

const store = createStore({
    modules: {
        auth: authModule,
        budget: budgetModule,
        transaction: transactionModule,
        insight: insight

    }
})

const app = createApp(App)
store.dispatch('restoreUser')

app.use(router).use(store).mount('#app')
