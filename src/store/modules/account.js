import webc from '@/utils/webc';
import ajax from '@/utils/ajax.js';
import BigNumber from 'bignumber.js';
import {
  get,
  set,
  isEmpty
} from 'lodash';

import {
  Message
} from 'element-ui';

const wallet_users = localStorage.getItem('gard_wallet_users') || '{}';
const wallet_username = localStorage.getItem('gard_wallet_username') || '';
const wallet_math_account = localStorage.getItem('gard_wallet_math_account') || '{}';
const userMap = JSON.parse(wallet_users) || {};
const keyStore = userMap[wallet_username] || {};
const mathAccount = JSON.parse(wallet_math_account) || {};

export default {
  namespaced: true,

  state: {
    loading: false,
    userName: wallet_username,
    account: {},
    mathAccount: {
      ...mathAccount
    },
    keyStore: keyStore,
    userMap: {
      ...userMap
    },
    balance: [],
    tokenMap: {},
    drawer: false,
    mathPlugin: false,
    nodes: []
  },

  getters: {
    currentAddress: function (state) {
      if (!isEmpty(state.mathAccount)) {
        return get(state.mathAccount, 'account');
      } else {
        return get(state.keyStore, 'address');
      }
    },
    gardBalance: function (state) {
      const gard = state.balance.find(i => i.denom === 'uif') || {
        amount: '0',
        denom: 'uif'
      };
      const res = {
        ...gard
      };
      res.amount = BigNumber(gard.amount)
        .dividedBy(Math.pow(10, 6))
        .toString();
      res.label = 'IF';
      return res;
    }
  },

  mutations: {
    setLoading: function (state, loading) {
      state.loading = loading;
    },
    setUserName: function (state, userName) {
      state.userName = userName;
    },
    setAccount: function (state, account) {
      state.account = account;
    },
    setMathAccount: function (state, mathAccount) {
      state.mathAccount = mathAccount;
    },
    setKeyStore: function (state, keyStore) {
      state.keyStore = keyStore;
    },
    setUserMap: function (state, userMap) {
      state.userMap = Object.assign({}, state.userMap, userMap);
    },
    resetUserMap: function (state, userMap) {
      state.userMap = userMap;
    },
    setBalance: function (state, balance) {
      state.balance = balance;
    },
    setTokenMap: function (state, data) {
      state.tokenMap = Object.assign({}, state.tokenMap, data);
    },
    setDrawer: function (state, data) {
      state.drawer = data
    },
    getmathPlugin: function (state) {
      if (!isEmpty(window.mathExtension)) {
        state.mathPlugin = true
      } else {
        state.mathPlugin = false
      }
    }
  },

  actions: {
    create: async function (context, {
      name,
      pass
    }) {
      // reject if name exist
      if (context.state.userMap[name]) {
        return Promise.resolve(false);
      }
      // create account
      const account = webc.account.create();
      context.commit('setUserName', name);
      context.commit('setAccount', account);
      // generate keyStore with password
      context.dispatch('generateKeyStore', pass);

      return Promise.resolve(true);
    },
    generateKeyStore: function (context, pass) {
      const keyStore = webc.account.toV3KeyStore(context.state.account.privateKey, pass);
      context.commit('setKeyStore', keyStore);
      return Promise.resolve();
    },
    finishCreate: async function (context) {
      const name = context.state.userName;
      context.commit('setUserMap', {
        [name]: context.state.keyStore
      });
      // save keyStore to localStorage
      localStorage.setItem('gard_wallet_username', name);
      localStorage.setItem('gard_wallet_users', JSON.stringify(context.state.userMap));
      // clear account mnemonic
      return Promise.resolve(true);
    },
    importPhrase: async function (context, {
      name,
      pass,
      phrase
    }) {
      // reject if name exist
      if (context.state.userMap[name]) {
        Message({
          type: 'error',
          message: 'Account exists!',
          center: true
        });
        return Promise.resolve();
      }
      try {
        const account = webc.account.recover(phrase);
        context.commit('setUserName', name);
        context.commit('setAccount', account);

        context.dispatch('generateKeyStore', pass);
        await context.dispatch('finishCreate');
        return Promise.resolve(account);
      } catch (e) {
        console.log(e);
        Message({
          type: 'error',
          message: 'Wrong mnemonic!',
          center: true
        });
        return Promise.resolve();
      }
    },
    importKeyStore: async function (context, {
      name,
      pass,
      keyStore
    }) {
      const key = JSON.parse(keyStore);
      let err = '';
      let account
      try {
        account = webc.account.fromV3KeyStore(key, pass);
        if (isEmpty(account)) {
          err = 'keyStore or password is invalid!';
        }
      } catch (e) {
        err = 'keyStore or password is invalid!';
      }
      if (err) {
        Message({
          type: 'error',
          message: err,
          center: true
        });
        return Promise.resolve();
      }
      context.commit('setUserName', name);
      context.commit('setKeyStore', key);

      await context.dispatch('finishCreate');
      return Promise.resolve(account);
    },
    change: async function (context, name) {
      const {
        userMap
      } = context.state;
      context.commit('setUserName', name);
      context.commit('setKeyStore', userMap[name] || {});
      localStorage.setItem('gard_wallet_username', name);
      return Promise.resolve(name);
    },
    editName: async function (context, {
      user,
      name
    }) {
      const {
        userMap,
        userName
      } = context.state;
      const userMapNew = {
        ...userMap
      };
      userMapNew[name] = userMapNew[user];
      delete userMapNew[user];
      context.commit('resetUserMap', userMapNew);
      // save change to localStorage
      localStorage.setItem('gard_wallet_users', JSON.stringify(context.state.userMap));

      // change currentUser
      if (userName === user) {
        await context.dispatch('change', name);
      }
      return Promise.resolve(name);
    },
    backup: async function (context, {
      user,
      pass
    }) {
      const {
        userMap
      } = context.state;
      const keyStore = userMap[user];
      const account = webc.account.fromV3KeyStore(keyStore, pass);
      return Promise.resolve(account);
    },
    delete: async function (context, {
      user,
      pass
    }) {
      const {
        userMap,
        userName
      } = context.state;
      const keyStore = userMap[user];
      const account = webc.account.fromV3KeyStore(keyStore, pass);
      const userMapNew = {
        ...userMap
      };
      delete userMapNew[user];
      context.commit('resetUserMap', userMapNew);
      // save change to localStorage
      localStorage.setItem('gard_wallet_users', JSON.stringify(context.state.userMap));

      // change currentUser if delete currentUser
      if (userName === user) {
        await context.dispatch('change', Object.keys(userMap)[0]);
      }
      return Promise.resolve(account);
    },
    getMathIdentity: async function (context) {
      // config network
      const network = {
        blockchain: 'infinitefuture',
        chainId: context.rootState.transactions.nodeInfo.node_info.network
      };
      // login math account
      let identity = {};
      try {
        identity = await mathExtension.getIdentity(network);
        context.commit('setMathAccount', identity);
        // clear local account
        context.commit('setUserName', '');
        context.commit('setKeyStore', {});
        localStorage.setItem('gard_wallet_username', '');
        localStorage.setItem('gard_wallet_math_account', JSON.stringify(identity));
      } catch (e) {
        console.log(e);
      }
      return Promise.resolve(identity);
    },
    resetMathIdentity: async function (context) {
      // logout
      let res = true;
      try {
        res = await mathExtension.forgetIdentity();
      } catch (e) {
        console.log(e);
      }
      if (res) {
        context.commit('setMathAccount', {});
        localStorage.setItem('gard_wallet_math_account', '{}');
      }
      return Promise.resolve(res);
    },
    fetchBalance: async function (context) {
      const address = context.getters.currentAddress;
      context.commit('setLoading', true);
      const {
        data
      } = await ajax.get(`bank/balances/${address}`);
      if (!isEmpty(data)) {
        // context.commit('setBalance', data.result);
        data.result.sort(i => (i.denom === 'uif' ? -1 : 1));
        context.commit('setBalance', data.result);
        data.result.forEach(i => {

        });
      } else {
        context.commit('setBalance', []);
      }
      context.commit('setLoading', false);
      return Promise.resolve(data);
    }
  }
};