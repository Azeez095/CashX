import api from "@/api/api";

export default {
  state: {
    budgets: []
  },
  mutations: {
    viewAllBudgets(state, budgets) {
      state.budgets = budgets;
    },
    addBudget(state, budget) {
      state.budgets.unshift(budget); // Add new budget to the top of the list
    },
    removeBudget(state, id) {
      state.budgets = state.budgets.filter((budget) => budget._id !== id); // Remove the budget by ID
    }
  },
  actions: {
    addBudget({ commit }, budget) {
      const payload = {
        title: budget.title,
        total_amount: budget.total_amount,
        duration: budget.duration
      };

      return api
        .post("/api/budgets", payload)
        .then((response) => {
          if (response.status === 201) {
            commit("addBudget", response.data.data); // Add to the top of the list in state
            return "Budget added successfully!";
          }
        })
        .catch((error) => {
          if (error.response && error.response.status === 500) {
            throw new Error("Failed to create budget. Please try again.");
          }
        });
    },

    removeBudget({ commit }, id) {
      return api
        .delete(`/api/budgets/${id}`)
        .then((response) => {
          if (response.status === 200) {
            commit("removeBudget", id); // Remove from the state after successful deletion
            return "Budget removed successfully!";
          }
        })
        .catch((error) => {
          if (error.response && error.response.status === 500) {
            throw new Error("Budget not found, it has been deleted.");
          } else {
            throw new Error("Failed to remove budget. Please try again.");
          }
          this.viewAllBudgets();
        });

    },

    viewAllBudgets({ commit }) {
      return api
        .get("/api/budgets?page=1&limit=1000")
        .then((response) => {
          const budgets = response.data.data;

          // Sort budgets in descending order based on a property, e.g., 'created_at'
          budgets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

          commit("viewAllBudgets", budgets);
        });
    },


    getBudget({ commit }, id) {
      return api.get(`/api/budgets/${id}`)
      .then((response) => {
        return response.data.data; // Return the budget data
      });
    },

    editBudget({ dispatch }, { id, budget }) {
      const payload = {
        title: budget.title,
        total_amount: budget.total_amount,
        duration: budget.duration
      };

      return  api
        .put(`/api/budgets/${id}`, payload)
        .then((response) => {
          if (response.status === 200) {
            dispatch("viewAllBudgets"); // Refresh the budget list
            return "Budget updated successfully!"
          }
        })
        .catch((error) => {
          if (error.response && error.response.status === 500) {
            throw new Error(
              "Failed to update budget. Duration is required."
            );
          } else {
            throw new Error("Failed to update budget. Please try again.");
          }
        });
    }
  },
  getters: {
    allBudgets(state) {
      return [...state.budgets].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  }

};
