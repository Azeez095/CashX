import api from "@/api/api";

export default {
  state: {
    budgets: [],
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
    },
  },
  actions: {
    async addBudget({ commit }, budget) {
      const payload = {
        title: budget.title,
        total_amount: budget.total_amount,
        duration: budget.duration,
      };

      try {
        const response = await api.post("/api/budgets", payload);
        if (response.status === 201) {
          commit("addBudget", response.data.data); // Add to the top of the list in state
          return response.data.message; // Return the newly created budget
        }
      } catch (error) {
        if (error.response && error.response.status === 500) {
          throw new Error(error.response.data.message);
        } else {
          throw new Error(error.response.data.message || error.message);
        }
      }
    },

    async removeBudget({ commit }, id) {
      try {
        const response = await api.delete(`/api/budgets/${id}`);
        if (response.status === 200) {
          commit("removeBudget", id); // Remove from the state after successful deletion
          return response.data.message;
        }
      } catch (error) {
        if (error.response && error.response.status === 500) {
          throw new Error(error.response.data.message);
        } else {
          throw new Error(error.response.data.message || error.message);
        }
      }
    },

    async viewAllBudgets({ commit }) {
      try {
        const response = await api.get("/api/budgets?page=1&limit=1000");
        const budgets = response.data.data;

        // Sort budgets in descending order based on a property, e.g., 'created_at'
        budgets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        commit("viewAllBudgets", budgets);
      } catch (error) {
        throw new Error(error.response?.data?.message || error.message);
      }
    },

    async getBudget({ commit }, id) {
      try {
        const response = await api.get(`/api/budgets/${id}`);
        return response.data.data; // Return the budget data
      } catch (error) {
        throw new Error(error.response?.data?.message || error.message);
      }
    },

    async editBudget({ dispatch }, { id, budget }) {
      const payload = {
        title: budget.title,
        total_amount: budget.total_amount,
        duration: budget.duration,
      };

      try {
        const response = await api.put(`/api/budgets/${id}`, payload);
        if (response.status === 200) {
          await dispatch("viewAllBudgets"); // Refresh the budget list
          return response.data.message;
        }
      } catch (error) {
        if (error.response && error.response.status === 500) {
          throw new Error(error.response.data.message);
        } else {
          throw new Error(error.response.data.message || error.message);
        }
      }
    },
  },
  getters: {
    allBudgets(state) {
      return [...state.budgets].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    },
  },
};
