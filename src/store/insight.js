import api from "@/api/api";

const state = {
  summary: null,
  isLoading: false,
  errorMessage: null,
};

const getters = {
  getSummary: (state) => state.summary,
  isLoading: (state) => state.isLoading,
  errorMessage: (state) => state.errorMessage,
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
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
