import api from "@/api/api";

export default {
  namespaced: true,
  state: {
    transactions: [],
    insightsSummary: {},
    monthlyInsights: [],
  },
  mutations: {
    SET_TRANSACTIONS(state, transactions) {
      state.transactions = transactions;
    },
    SET_INSIGHTS_SUMMARY(state, summary) {
      state.insightsSummary = summary;
    },
    SET_MONTHLY_INSIGHTS(state, monthlyInsights) {
      state.monthlyInsights = monthlyInsights;
    },
  },
  actions: {
    async fetchTransactions({ commit }) {
      try {
        const response = await api.get("/api/transactions");
        commit("SET_TRANSACTIONS", response.data.data);
      } catch (error) {
        throw new Error(response.data.message);
      }
    },
    async fetchInsightsSummary({ commit }) {
      try {
        const response = await api.get("/api/insights/summary");
        commit("SET_INSIGHTS_SUMMARY", response.data.data);
      } catch (error) {
        console.error(response.data.message);
      }
    },
    async fetchMonthlyInsights({ commit }) {
      try {
        const response = await api.get("/api/insights/monthly");
        // Assuming the response structure has a "data" property containing the array
        commit("SET_MONTHLY_INSIGHTS", response.data.data); // Save only the array
      } catch (error) {
        console.error(response.data.message);
      }
    },
  },
  getters: {
    getTransactions: (state) => state.transactions,
    getInsightsSummary: (state) => state.insightsSummary,
    getMonthlyInsights: (state) => state.monthlyInsights,
  },
};
