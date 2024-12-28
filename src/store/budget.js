import api from "@/api/api";

export default {
    state: {
        budgets: [
        ]
    },
    mutations: {
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
          api.post('/api/budgets', payload)
          .then((response) => {
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
          api.get('/api/budgets?page=1&limit=1000').then((response) => {
            commit('viewAllBudgets', response.data.data);
            console.log(response.data.data);
          });
        },
        getBudget({ commit }, id) {
          return api.get(`/api/budgets/${id}`).then((response) => {
            return response.data.data; // Return the budget data
          });
        },
        editBudget({ dispatch }, { id, budget }) {
          const payload = {
            title: budget.title,
            total_amount: budget.total_amount,
            duration: budget.duration,
          };

          return api.put(`/api/budgets/${id}`, payload)
          .then((response) => {
            if (response) {
              dispatch("viewAllBudgets"); // Refresh the budget list
              return response.data; // Return data for optional feedback
            }
          })
          .catch((error) => {
            if (error.response && error.response.status === 500 ) {
              throw new Error("Failed to update budget. Duration is required.");
            }
            else{
              throw new Error("Failed to update budget. Please try again.");}
          });
        },

      },
      getters: {
        allBudgets(state) {
          return state.budgets;
        },
      }
}

