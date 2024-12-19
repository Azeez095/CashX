// import api from "@/api/api";

export default {
    state: {
        budgets: [
            {
                id: 1,
                title: 'Rent',
                amount: 2000000,
                duration: 'Monthly',
                isOpen: false,
            },
            {
                id: 2,
                title: 'Phone',
                amount: 200000,
                duration: 'Monthly',
                isOpen: false,
            },
            {
                id: 3,
                title: 'Cable TV',
                amount: 40000,
                duration: 'Monthly',
                isOpen: false,
            },
            {
                id: 4,
                title: 'Fuel',
                amount: 200000,
                duration: 'Monthly',
                isOpen: false,
            },

            {
                id: 5,
                title: 'Entertainment',
                amount: 500000,
                duration: 'Monthly',
                isOpen: false,
            },
        ]
    },
    mutations: {
        addBudget(state, budget) {
          state.budgets.push(budget);
        },
        removeBudget(state, id) {
          state.budgets = state.budgets.filter(budget => budget.id !== id);
        }
      },
      actions: {
        addBudget({ commit }, budget) {
          commit('addBudget', budget);
        },
        removeBudget({ commit }, id) {
          commit('removeBudget', id);
        }
      },
      getters: {
        allBudgets(state) {
          return state.budgets;
        },
      }
}
