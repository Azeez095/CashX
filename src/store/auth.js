import api from '../api/api';
import router from '../router';

export default {
  state: {
    user: {
      name: ''
    },
    token: localStorage.getItem('authToken') || null,
  },
  mutations: {
    SET_USER(state, user) {
      state.user.name = user;
      localStorage.setItem('user', JSON.stringify({ name: user }));
    },
    SET_TOKEN(state, token) {
      state.token = token;
      localStorage.setItem('authToken', token);
    },
    LOGOUT(state) {
      state.user = { name: '' }; // Reset to initial structure instead of null
      state.token = null;
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    },
  },
  actions: {
    async login({ commit }, credentials) {
      try {
        const response = await api.post('/api/login', credentials);
        if (response.status) {
          const { token, name } = response.data.data;
          commit('SET_TOKEN', token); // Save token to Vuex and localStorage
          commit('SET_USER', name); // Save user to Vuex and localStorage
          router.push('/dashboard');
        }
      } catch (error) {
        throw new Error('Invalid email or password');
      }
    },

    async signup({ commit }, userDetails) {
      try {
        const response = await api.post('/api/register', userDetails);
        if (response.status) {
          const { token, name } = response.data.data;
          commit('SET_TOKEN', token); // Save token
          commit('SET_USER', name); // Save user
          //router.push('/dashboard');
        }
      } catch (error) {
        console.error('Signup error:', error);
      }
    },

    logout({ commit }) {
      commit('LOGOUT');
      router.push('/login');
    },

    restoreUser({ commit }) {
      const savedUser = localStorage.getItem('user');
      const token = localStorage.getItem('authToken');
      if (savedUser && token) {
        const user = JSON.parse(savedUser); // Parse the saved user data
        commit('SET_USER', user.name); // Restore user name to Vuex
        commit('SET_TOKEN', token); // Restore token to Vuex
      }
    },
  },
};
