import webc from '@/utils/webc';
import ajax from '@/utils/ajax.js';
import {
  get,
  set,
  isEmpty
} from 'lodash';
import {
  sendTx
} from '@/utils/helpers';

export default {
  namespaced: true,

  state: {
    loading: false,
    nodeInfo: {},
    txs: [],
    creatTxs: [],
    injectTxs: [],
    cancelTxs: [],
    sendTxs: [],
    depositTxs: [],
    depositInjectFirst: [],
    depositCancelFirst: [],
    depositWithdrawFirst: [],
    futureInjectFirst: [],
    futureCancelFirst: [],
    futureWithdrawFirst: [],
    txInfo: {},
    form: {
      denom: 'uif',
      fee: 0
    },
    result: {},
    memo: false,
    totalCount: 0,
    pageSize: 20,
    currentPage: 1,
    details: {},
    tokenTx: []
  },

  getters: {},

  mutations: {
    setLoading: function (state, loading) {
      state.loading = loading;
    },
    setNodeInfo: function (state, nodeInfo) {
      state.nodeInfo = nodeInfo;
    },
    setTxList: function (state, txs) {
      state.txs = txs.reverse();
    },
    setTokenTx: function (state, txs) {
      state.tokenTx = [...state.tokenTx, ...txs.reverse()]
    },
    setCreatTxsEmpty: function (state) {
      state.creatTxs = []
    },
    setInjectTxsEmpty: function (state) {
      state.injectTxs = []
    },
    setCancelTxsEmpty: function (state) {
      state.cancelTxs = []
    },
    setSendTxsEmpty: function (state) {
      state.sendTxs = []
    },
    setDepositTxsEmpty: function (state) {
      state.depositTxs = []
    },
    setCreatTxs: function (state, txs) {
      state.creatTxs = [...state.creatTxs, ...txs]
    },
    setInjectTxs: function (state, txs) {
      state.injectTxs = [...state.injectTxs, ...txs]
    },
    setCancelTxs: function (state, txs) {
      state.cancelTxs = [...state.cancelTxs, ...txs]
    },
    setSendTxs: function (state, txs) {
      state.sendTxs = [...state.sendTxs, ...txs]
    },
    setDepositTxs: function (state, txs) {
      state.depositTxs = [...state.depositTxs, ...txs]
    },
    setDepositInjectFirst: function (state, txs) {
      state.depositInjectFirst = txs
    },
    setDepositCancelFirst: function (state, txs) {
      state.depositCancelFirst = txs
    },
    setDepositWithdrawFirst: function (state, txs) {
      state.depositWithdrawFirst = txs
    },
    setFutureInjectFirst: function (state, txs) {
      state.futureInjectFirst = txs
    },
    setFutureCancelFirst: function (state, txs) {
      state.futureCancelFirst = txs
    },
    setFutureWithdrawFirst: function (state, txs) {
      state.futureWithdrawFirst = txs
    },
    setTxInfo: function (state, txInfo) {
      state.txInfo = Object.assign({}, txInfo, state.txInfo);
    },
    setForm: function (state, form) {
      state.form = form;
    },
    setResult: function (state, result) {
      state.result = result;
    },
    setMemo: function (state, data) {
      state.memo = data
    },
    setTotalCount: function (state, data) {
      state.totalCount = data;
    },
    setDetails: function (state, data) {
      const details = state.details;
      const {
        txhash
      } = data;
      if (isEmpty(details[txhash])) {
        state.details = Object.assign({}, state.details, {
          [txhash]: data
        });
      }
    },
    setTokenTxEmpty: function (state) {
      state.tokenTx = []
    }
  },

  actions: {
    getNodeInfo: async function (context) {
      const {
        data
      } = await ajax.get('/node_info');
      if (isEmpty(data)) {
        return Promise.reject();
      }
      context.commit('setNodeInfo', data);
      return Promise.resolve();
    },
    fetchTxsTotalCount: async function (context, params) {
      const {
        data
      } = await ajax.get('/txs', {
        params
      });
      if (isEmpty(data)) {
        return Promise.resolve();
      }
      return Promise.resolve(data);
    },
    fetchTxsLatest: async function (context, params) {
      let txs = [];
      // 1. first query to get total count
      const sendData1 = await context.dispatch('fetchTxsTotalCount', params);
      if (!isEmpty(sendData1)) {
        if (sendData1.totalCount > params.limit) {
          // 2. query last page
          const lastPage = Math.ceil(sendData1.totalCount / params.limit) || 1;
          const sendData = await context.dispatch('fetchTxsTotalCount', {
            ...params,
            page: lastPage
          });
          txs = sendData.txs;
        } else {
          // 3. else use data of first query
          txs = sendData1.txs;
        }
      }
      return Promise.resolve(txs);
    },
    fetchTxs: async function (context, keyStore) {
      const limit = 10;
      const address = context.rootGetters['account/currentAddress'];
      const params = {
        limit,
        action: 'send',
        sender: address
      };
      context.commit('setLoading', true);

      // 1. query txs as sender
      const sendList = await context.dispatch('fetchTxsLatest', params);

      // 2. query txs as recipient
      params.recipient = params.sender;
      delete params.sender;
      const receiveList = await context.dispatch('fetchTxsLatest', params);

      // show action as receive
      const receiveListMaped = receiveList.map(i => {
        set(i, 'tags.0.value', 'receive');
        return i;
      });
      const list = [...sendList, ...receiveListMaped];
      list.sort((a, b) => b.height - a.height);
      context.commit('setTxList', list);
      context.commit('setLoading', false);
      return Promise.resolve(list);
    },
    // fetch txs all
    fetchTxsAll: async function (context, params) {
      const {
        data
      } = await ajax.get('/txs', {
        params
      });
      const totalPage = Math.ceil(data.totalCount / params.limit) || 1;
      const list = data.txs
      if (params.category === 'deposit') {
        context.commit("setDepositTxs", list)
      } else if (params.category === 'future') {

      } else {
        switch (params.action) {
          case "create":
            context.commit("setCreatTxs", list.reverse())
            break
          case "inject":
            context.commit("setInjectTxs", list)
            break
          case "cancel":
            context.commit("setCancelTxs", list)
            break
          case "send":
            context.commit("setSendTxs", list)
            break
        }
      }

      if (params.page < totalPage) {
        params.page += 1
        context.dispatch("fetchTxsAll", params)
      } else {
        return Promise.resolve(data);
      }
    },
    // Get the last two pages of data
    fetchTxLastSecond: async function (context, params) {
      const {
        data
      } = await ajax.get('/txs', {
        params
      });
      const totalPage = Math.ceil(data.totalCount / params.limit) || 1;
      let lastPageData, secondPageData
      if (totalPage >= 2) {
        params.page = totalPage
        lastPageData = await ajax.get('/txs', {
          params
        });
        params.page -= 1
        secondPageData = await ajax.get('/txs', {
          params
        });
      } else {
        params.page = totalPage
        lastPageData = await ajax.get('/txs', {
          params
        });
        secondPageData = {
          data: {
            txs: []
          }
        }
      }
      const list = [...lastPageData.data.txs, ...secondPageData.data.txs]
      list.sort((a, b) => b.height - a.height);
      if (params.action === "inject" && params.category === "deposit") {
        context.commit("setDepositInjectFirst", list)
      }
      if (params.action === "cancel" && params.category === "deposit") {
        context.commit("setDepositCancelFirst", list)
      }
      if (params.action === "withdraw" && params.category === "deposit") {
        context.commit("setDepositWithdrawFirst", list)
      }
      if (params.action === "inject" && params.category === "future") {
        context.commit("setFutureInjectFirst", list)
      }
      if (params.action === "cancel" && params.category === "future") {
        context.commit("setFutureCancelFirst", list)
      }
      if (params.action === "withdraw" && params.category === "future") {
        context.commit("setFutureWithdrawFirst", list)
      }
      return Promise.resolve(list);
    },
    fetchTxInfo: async function (context, txhash) {
      if (!isEmpty(context.state.txInfo[txhash])) {
        return Promise.resolve(context.state.txInfo[txhash]);
      }
      const {
        data
      } = await ajax.get(`/txs/${txhash}`);
      if (!isEmpty(data)) {
        context.commit('setTxInfo', {
          [txhash]: data
        });
      }
      return Promise.resolve(data);
    },
    input: async function (context, form) {
      context.commit('setForm', form);
      return Promise.resolve(form);
    },
    result: async function (context, result) {
      context.commit('setResult', result);
      return Promise.resolve(result);
    },
    send: async function (context, {
      pass,
      amount
    }) {
      const {
        form: {
          denom,
          address,
          memo
        }
      } = context.state;
      const msg = {
        memo,
        to: address,
        coins: [{
          denom,
          amount
        }]
      };

      const {
        data
      } = await sendTx(context, pass, 'transfer', msg);
      return Promise.resolve(data);
    },
    fetchMemo: async function (context, address) {
      const {
        data
      } = await ajax.get(`/account/query/${address}`);
      context.commit("setMemo", data.memo_required)
      return Promise.resolve(data);
    },

    //copy from gardPlorer
    fetchTotalCount: async function (context, params = {
      'message.action': 'send',
      page: 1
    }) {
      context.commit('setLoading', true);
      const {
        data
      } = await ajax.get('/txs', {
        params
      });
      context.commit('setLoading', false);
      if (isEmpty(data)) {
        return Promise.reject();
      }
      context.commit('setTotalCount', Number(data.total_count));
      return Promise.resolve();
    },
    fetchList: async function (context, params = {
      'message.action': 'send',
      page: 1
    }) {
      context.commit('setTxList', []);
      params.limit = context.state.pageSize;
      context.commit('setLoading', true);
      const {
        data
      } = await ajax.get('/txs', {
        params
      });
      context.commit('setLoading', false);
      if (isEmpty(data)) {
        return Promise.reject();
      }
      context.commit('setTotalCount', Number(data.total_count));
      context.commit('setTxList', data.txs);
      return Promise.resolve();
    },
    fetch: async function (context, hash) {
      // check if existed;
      if (!isEmpty(context.state.details[hash])) {
        return Promise.resolve();
      }
      context.commit('setLoading', true);
      const {
        data
      } = await ajax.get(`/txs/${hash}`);
      context.commit('setLoading', false);
      if (isEmpty(data)) {
        return Promise.reject();
      }
      context.commit('setDetails', data);
      return Promise.resolve(data);
    },
    fetchTokenTx: async function (context, params = {
      'message.action': 'send',
      page: 1
    }) {
      context.commit('setTokenTx', []);
      params.limit = context.state.pageSize;
      context.commit('setLoading', true);
      const {
        data
      } = await ajax.get('/txs', {
        params
      });
      context.commit('setLoading', false);
      if (isEmpty(data)) {
        return Promise.reject();
      }
      context.commit('setTotalCount', Number(data.total_count));
      context.commit('setTokenTx', data.txs);
      return Promise.resolve();
    },
    editValidator: async function (context, params) {
      const msg = {
        "type": "cosmos-sdk/MsgEditValidator",
        "Description": {
          "moniker": params.moniker,
          "identity": "owner",
          "website": params.website,
          "details": params.details
        },
        "address": params.address,
        "commission_rate": "",
        "min_self_delegation": ""
      }
      const {
        data
      } = await sendTx(context, params.pass, 'hg-custom', msg);
      return Promise.resolve(data);
    },
    editWithdraw: async function (context, params) {
      const msg = {
        "type": "cosmos-sdk/MsgModifyWithdrawAddress",
        "delegator_address": params.address,
        "withdraw_address": params.newAddress
      }
      const {
        data
      } = await sendTx(context, params.pass, 'hg-custom', msg);
      return Promise.resolve(data);
    }
  }
};