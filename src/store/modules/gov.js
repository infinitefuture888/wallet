import {
  isEmpty,
  unionWith,
  isEqual,
  get
} from 'lodash';
import ajax from '@/utils/ajax.js';
import {
  sendTx
} from '@/utils/helpers';
export default {
  namespaced: true,
  state: {
    proposalList: [],
    proposalMap: {},
    votes: [],
    minDeposit: {}
  },
  getters: {

  },
  mutations: {
    setList(state, data) {
      state.proposalList = data
    },
    setMap(state, data) {
      state.proposalMap = Object.assign({}, state.proposalMap, data)
    },
    setVotes(state, data) {
      state.votes = data
    },
    setMinDeposit(state, data) {
      state.minDeposit = data
    }
  },
  actions: {
    list: async function (context, params) {
      const {
        data
      } = await ajax.get("gov/proposals", {
        params
      })
      if (data) {
        context.commit("setList", data.result)
        data.result.forEach(i => {
          context.commit("setMap", {
            [i.id]: i
          })
          const denom = get(i, "total_deposit.0.denom")
        });
      }

      return Promise.resolve(data);
    },
    create: async function (context, params) {
      const address = context.rootGetters['account/currentAddress'];
      const msg = {
        type: "cosmos-sdk/MsgSubmitProposal",
        content: {
          type: "cosmos-sdk/TextProposal",
          value: {
            title: params.title,
            description: params.description
          }
        },
        initial_deposit: [{
          denom: params.denom,
          amount: params.amount
        }],
        proposer: address
      }
      const {
        data
      } = await sendTx(context, params.pass, 'hg-custom', msg);
      return Promise.resolve(data);
    },
    deposit: async function (context, params) {
      const address = context.rootGetters['account/currentAddress'];
      const msg = {
        type: "cosmos-sdk/MsgDeposit",
        proposal_id: params.id,
        depositor: address,
        amount: [{
          denom: params.denom,
          amount: params.amount
        }]
      }
      const {
        data
      } = await sendTx(context, params.pass, 'hg-custom', msg);
      return Promise.resolve(data);
    },
    vote: async function (context, params) {
      const address = context.rootGetters['account/currentAddress'];
      const msg = {
        type: "cosmos-sdk/MsgVote",
        proposal_id: params.id,
        voter: address,
        option: params.option
      }
      const {
        data
      } = await sendTx(context, params.pass, 'hg-custom', msg);
      return Promise.resolve(data);
    },
    fetchVotes: async function (context, id) {
      const {
        data
      } = await ajax.get(`gov/proposals/${id}/votes`)
      if (data) {
        context.commit("setVotes", data.result)
      }
      return Promise.resolve(data)
    },
    fetchMinDeposit: async function (context) {
      const {
        data
      } = await ajax.get("gov/parameters/deposit")
      if (data) {
        context.commit("setMinDeposit", data.result)
      }
      return Promise.resolve(data)
    }
  }
}