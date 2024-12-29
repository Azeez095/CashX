import api from "@/api/api";

const state = {
  summary: null,
  isLoading: false,
  errorMessage: null,
  budgets: [], // Store for budget data
  recentTransactions: [], // Store for recent transactions data
  monthlyInsights: [], // Store for monthly insights data
};

const getters = {
  getSummary: (state) => state.summary,
  isLoading: (state) => state.isLoading,
  errorMessage: (state) => state.errorMessage,
  getBudgets: (state) => state.budgets,
  getRecentTransactions: (state) => state.recentTransactions,
  getMonthlyInsights: (state) => state.monthlyInsights,
};

const mutations = {
  SET_SUMMARY(state, summary) {
    state.summary = summary;
  },
  SET_LOADING(state, isLoading) {
    state.isLoading = isLoading;
  },
  SET_ERROR(state, errorMessage) {
    state.errorMessage = errorMessage;
  },
  SET_BUDGETS(state, budgets) {
    state.budgets = budgets;
  },
  SET_RECENT_TRANSACTIONS(state, transactions) {
    state.recentTransactions = transactions;
  },
  SET_MONTHLY_INSIGHTS(state, monthlyInsights) {
    state.monthlyInsights = monthlyInsights;
  },
};

const actions = {
  async fetchSummary({ commit }) {
    commit("SET_LOADING", true);
    commit("SET_ERROR", null); // Clear any existing error
    try {
      const response = await api.get("/api/insights/summary");
      if (response.data.success) {
        commit("SET_SUMMARY", response.data.data);
      } else {
        commit("SET_ERROR", response.data.message || "Failed to fetch data");
      }
    } catch (error) {
      commit("SET_ERROR", error.message || "An error occurred");
    } finally {
      commit("SET_LOADING", false);
    }
  },

  // Fetch budgets from the API
  async fetchBudgets({ commit }) {
    commit("SET_LOADING", true);
    commit("SET_ERROR", null); // Clear any existing error
    try {
      const response = await api.get("/api/budgets");
      if (response.data.success) {
        commit("SET_BUDGETS", response.data.data); // Assuming data is in response.data.data
      } else {
        commit("SET_ERROR", response.data.message || "Failed to fetch budget data");
      }
    } catch (error) {
      commit("SET_ERROR", error.message || "An error occurred while fetching budgets");
    } finally {
      commit("SET_LOADING", false);
    }
  },

  // Fetch recent transactions from the API
  async fetchRecentTransactions({ commit }) {
    commit("SET_LOADING", true);
    commit("SET_ERROR", null);
    try {
      const response = await api.get("/api/transactions");
      if (response.data.success) {
        commit("SET_RECENT_TRANSACTIONS", response.data.data.slice(0, 5)); // Limit to the first 5 transactions
      } else {
        commit("SET_ERROR", response.data.message || "Failed to fetch transactions");
      }
    } catch (error) {
      commit("SET_ERROR", error.message || "An error occurred while fetching transactions");
    } finally {
      commit("SET_LOADING", false);
    }
  },

  // Fetch monthly insights from the API
  async fetchMonthlyInsights({ commit }) {
    commit("SET_LOADING", true);
    commit("SET_ERROR", null);
    try {
      const response = await api.get("/api/insights/monthly");
      if (response.data.success) {
        commit("SET_MONTHLY_INSIGHTS", response.data.data);
      } else {
        commit("SET_ERROR", response.data.message || "Failed to fetch monthly insights");
      }
    } catch (error) {
      commit("SET_ERROR", error.message || "An error occurred while fetching monthly insights");
    } finally {
      commit("SET_LOADING", false);
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
