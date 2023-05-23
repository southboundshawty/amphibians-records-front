import { createStore } from 'vuex';
import API from '@/api';

import {
  getProfileInfo,
} from '@/api/user.js';

export default createStore({
  state: {
    user: {},
    token: null,
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload;
    },
    setToken(state, payload) {
      state.token = payload;
    },
  },
  getters: {
    isUserLogin(state) {
      return !!state.token;
    },
    isModerator(state) {
      if (state.user.roles) {
        return state.user.roles.includes('Moder');
      }
      return false;
    },
  },
  actions: {
    async signOut({ state }) {
      state.user = {};
      state.token = null;
      localStorage.removeItem('jwt');
      delete API.defaults.headers[process.env.VUE_APP_AUTH_HEADER];
      delete API.defaults.headers.jwt;
      return Promise.resolve();
    },
    setUser({ commit }, payload) {
      commit('setUser', payload);
      commit('setToken', payload.token);
    },
    async getUser({ dispatch }) {
      await dispatch('getProfile');
    },
    async getProfile({ commit }) {
      const { data } = await getProfileInfo();
      commit('setUser', data);
      commit('setToken', data.token);
    },
  },
  modules: {
  },
});
