import Vuex from 'vuex';
import Vue from 'vue';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    location: 'brooklyn',
    status: {
      done: false,
      searchDone: false,
      currentPrice: 0,
      demand: 0,
      listingsCount: 0,
      demandDone: 0,
    },
    heatmapPoints: [],
    requestId: '',
    polling: false,
  },
  /* eslint-disable no-param-reassign */
  mutations: {
    set_points: (state, points) => {
      state.heatmapPoints = points;
    },
    set_polling: (state, isPolling) => {
      state.polling = isPolling;
    },
    set_status: (state, status) => {
      state.status = status;
    },
    set_location: (state, location) => {
      state.location = location;
    },
    set_request_id: (state, id) => {
      state.requestId = id;
    },
  },
  /* eslint-enable no-param-reassign */
  actions: {
    cancelSearch: ({ commit }) => {
      commit('set_polling', false);
      commit('set_request_id', null);
    },
    getPoints: async ({ state, commit, dispatch }) => {
      dispatch('cancelSearch');
      commit('set_points', []);
      const data = await (await fetch(`/api/heatmap/${state.location}`)).json();
      if (data.points) {
        commit('set_points', data.points);
        commit('set_polling', false);
      } else {
        commit('set_request_id', data.requestId);
        commit('set_status', {
          done: false,
          searchDone: false,
          currentPrice: 0,
          demand: 0,
          listingsCount: 0,
          demandDone: 0,
        });
        dispatch('poll', data.requestId);
      }
    },
    poll: async ({ state, commit, dispatch }, id) => {
      if (state.requestId !== id || !state.requestId || !id) return;
      commit('set_polling', true);
      const data = await (await fetch(`/api/status/${state.requestId}`)).json();
      commit('set_status', data);
      if (data.done) {
        commit('set_polling', false);
        dispatch('getPoints');
      } else {
        setTimeout(() => dispatch('poll', id), 1000);
      }
    },
  },
});
