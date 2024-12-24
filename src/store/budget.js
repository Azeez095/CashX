import api from "@/api/api";

export default {
    state: {
        budgets: [
        ]
    },
    mutations: {
      //  addBudget(state, budget) {
      //     state.budgets.push(budget);
      //   },
      //   removeBudget(state, id) {
      //     state.budgets = state.budgets.filter(budget => budget.id !== id);
      //   },
        viewAllBudgets(state, budgets) {
          state.budgets = budgets
        }
      },
      actions: {
        addBudget({ dispatch }, budget) {
          const payload= {
            title: budget.title,
            total_amount: budget.total_amount,
            duration: budget.duration
          }
          api.post('/api/budgets', payload).then((response) => {
            if(response) {
              dispatch('viewAllBudgets');
            }
          })

        },
        removeBudget({ dispatch }, id) {
        api.delete(`/api/budgets/${id}`).then((response) => {
          if(response) {
            dispatch('viewAllBudgets');
          }
        });
        //  commit('removeBudget', id);
        },
        viewAllBudgets({ commit }) {
          api.get('/api/budgets').then((response) => {
            commit('viewAllBudgets', response.data.data);
            console.log(response.data.data);
          });
        }
      },
      getters: {
        allBudgets(state) {
          return state.budgets;
        },
      }
}

