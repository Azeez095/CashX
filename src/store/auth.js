import api from '../api/api';

export default{
  state: {
    user: {
      name: 'Amoo Abdulazeez'
    },
    token: localStorage.getItem('authToken') || null,
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
    SET_TOKEN(state, token) {
      state.token = token;
      localStorage.setItem('authToken', token);
    },
    LOGOUT(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem('authToken');
    },
  },
  actions: {
    async login({ commit }, credentials) {
      try {
        const response = await api.post('/api/login', credentials);
        commit('SET_TOKEN', response.data.token);
        commit('SET_USER', response.data.user);
      } catch (error) {
        console.error("Login error:", error);
      }
    },
    async signup({ commit }, userDetails) {
      const response = await api.post('/api/register', userDetails);
      commit('SET_TOKEN', response.data.token);
      commit('SET_USER', response.data.user);
    },
    logout({ commit }) {
      commit('LOGOUT');
    },
  },
};
