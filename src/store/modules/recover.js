export default {
  namespaced: true,

  state: {
    keyText: '',
    phrase: ''
  },

  getters: {},

  mutations: {
    setKeyText: function(state, keyText) {
      state.keyText = keyText;
    },
    setPhrase: function(state, phrase) {
      state.phrase = phrase;
    }
  },

  actions: {
    inputKey: async function(context, { keyStore }) {
      context.commit('setKeyText', keyStore);
      return Promise.resolve(keyStore);
    },
    inputPhrase: async function(context, { phrase }) {
      context.commit('setPhrase', phrase);
      return Promise.resolve(phrase);
    },
    clearKey: async function(context) {
      context.commit('setKeyText', '');
      context.commit('setPhrase', '');
      return Promise.resolve(true);
    }
  }
};
