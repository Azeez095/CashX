import { createApp } from 'vue';
import { createStore } from 'vuex';
import App from './App.vue'
import router from './router'
import authModule from './store/auth';
import budgetModule from './store/budget';
import transactionModule from './store/transaction';

const store = createStore({
    modules: {
        auth: authModule,
        budget: budgetModule,
        transaction: transactionModule
    }
})

const app = createApp(App)

app.use(router).use(store).mount('#app')
