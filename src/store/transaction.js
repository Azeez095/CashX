import api from "@/api/api";

export default {
    state: {
        transactions: []
    },
    mutations: {
        viewAllTransactions(state, transactions) {
            state.transactions = transactions;
        },
    },
    actions: {
        addTransaction({ dispatch }, transaction) {
            const payload = {
                narration: transaction.narration,
                category: transaction.category,
                amount: transaction.amount,
                type: transaction.type,
                budget_id: transaction.budget_id,  // Assuming transaction belongs to a budget
            };
            api.post('/api/transactions', payload).then((response) => {
                if (response) {
                    dispatch('viewAllTransactions');
                }
            });
        },
        removeTransaction({ dispatch }, id) {
            api.delete(`/api/transactions/${id}`).then((response) => {
                if (response) {
                    dispatch('viewAllTransactions');
                }
            });
        },
        viewAllTransactions({ commit }) {
            api.get('/api/transactions?page=1&limit=1000').then((response) => {
                commit('viewAllTransactions', response.data.data);
            });
        },
        editTransaction({ dispatch }, { id, transaction }) {
            const payload = {
                amount: transaction.amount,
                category: transaction.category,
                narration: transaction.narration,
                type: transaction.type,
                budget_id: transaction.budget_id,

            };

            return api.put(`/api/transactions/${id}`, payload).then((response) => {
                if (response) {
                    dispatch('viewAllTransactions'); // Refresh the transaction list
                    return response.data; // Return data for optional feedback
                }
            });
        },
    },
    getters: {
        allTransactions(state) {
            return state.transactions;
        },
    },
};
