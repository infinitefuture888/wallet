import webc from '@/utils/webc';
import BigNumber from 'bignumber.js';
import {
  isEmpty
} from 'lodash';
import ajax from '@/utils/ajax.js';
import {
  sendTx
} from '@/utils/helpers';

export default {
  namespaced: true,

  state: {
    delegations: [],
    delegationMap: {},
    rewards: [],
    rewardMap: {},
    validators: [],
    validatorMap: {},
    toValidator: {},
    fromValidator: {},
    form: {},
    unbindings: [],
    unbindingMap: {},
    addressRedelegations: [],
    distributionMap: {}
  },

  getters: {},

  mutations: {
    setDelegations: function (state, data) {
      state.delegations = data;
    },
    setDelegationMap: function (state, data) {
      state.delegationMap = data;
    },
    setDelegation: function (state, data) {
      state.delegationMap = Object.assign({}, state.delegationMap, data);
    },
    setRewards: function (state, data) {
      state.rewards = data;
    },
    setRewardMap: function (state, data) {
      state.rewardMap = Object.assign({}, state.rewardMap, data);
    },
    setValidators: function (state, data) {
      state.validators = data;
    },
    // setValidatorMap: function (state, data) {
    //   state.validatorMap = data;
    // },
    setToValidator: function (state, data) {
      state.toValidator = data;
    },
    setFromValidator: function (state, data) {
      state.fromValidator = data;
    },
    setForm: function (state, data) {
      state.form = data;
    },
    setUnbindings: function (state, data) {
      state.unbindings = data;
    },
    setValidatorMap: function (state, data) {
      state.validatorMap = Object.assign({}, state.validatorMap, data);
    },
    setUnbindingMap: function (state, data) {
      state.unbindingMap = Object.assign({}, state.unbindingMap, data);
    },
    setValidatorMapEmpty: function (state) {
      state.validatorMap = {}
    },
    setDelegationsEmpty: function (state) {
      state.delegations = [];
    },
    setAddressRedelegations(state, data) {
      state.addressRedelegations = data
    },
    setDistributionMap(state, data) {
      state.distributionMap = Object.assign({}, state.distributionMap, data)
    }
  },

  actions: {
    fetchDelegations: async function (context) {
      const address = context.rootGetters['account/currentAddress'];
      const {
        data
      } = await ajax.get(`/staking/delegators/${address}/delegations`);
      if (!isEmpty(data)) {
        context.commit('setDelegations', data.result);
        const delegationMap = {};
        data.result.forEach(i => {
          delegationMap[i.validator_address] = i;
        });
        context.commit('setDelegationMap', delegationMap);
      }
      return Promise.resolve(data);
    },
    fetchDelegation: async function (context, validator_addr) {
      const address = context.rootGetters['account/currentAddress'];
      const {
        data
      } = await ajax.get(`/staking/delegators/${address}/delegations/${validator_addr}`);
      if (!isEmpty(data)) {
        context.commit('setDelegation', {
          [validator_addr]: data
        });
      }
      return Promise.resolve(data);
    },
    fetchRewards: async function (context) {
      const address = context.rootGetters['account/currentAddress'];
      const {
        data
      } = await ajax.get(`/distribution/delegators/${address}/rewards`);
      if (!isEmpty(data.result.total)) {
        context.commit('setRewards', data.result.total);

        data.result.total.forEach(i => {
          context.commit('setRewardMap', {
            [i.operator_address]: i
          });
        });
      }
      return Promise.resolve(data);
    },
    fetchReward: async function (context, validator_addr) {
      const address = context.rootGetters['account/currentAddress'];
      const {
        data
      } = await ajax.get(`/distribution/delegators/${address}/rewards/${validator_addr}`);
      if (!isEmpty(data)) {
        context.commit('setRewardMap', {
          [validator_addr]: data
        });
      }
      return Promise.resolve(data);
    },
    fetchUnbindings: async function (context) {
      const address = context.rootGetters['account/currentAddress'];
      const {
        data
      } = await ajax.get(`/staking/delegators/${address}/unbonding_delegations`);
      if (!isEmpty(data)) {
        context.commit('setUnbindings', data.result);
        data.result.forEach(i => {
          context.commit('setUnbindingMap', {
            [i.validator_address]: i
          });
        });
      }
      return Promise.resolve(data);
    },
    fetchUnbinding: async function (context, validator_addr) {
      const address = context.rootGetters['account/currentAddress'];
      const {
        data
      } = await ajax.get(`/staking/delegators/${address}/unbonding_delegations/${validator_addr}`);
      if (!isEmpty(data)) {
        context.commit('setUnbindingMap', {
          [validator_addr]: data
        });
      }
      return Promise.resolve(data);
    },
    fetchValidators: async function (context, isMy) {
      const {
        data
      } = await ajax.get('/staking/validators?status=bonded');
      const {
        data: unbondedData
      } = await ajax.get('/staking/validators?status=unbonded');
      const {
        data: unbondingData
      } = await ajax.get('/staking/validators?status=unbonding');
      if (isEmpty(data) || isEmpty(unbondedData) || isEmpty(unbondingData)) {
        return Promise.reject();
      }
      const result = [...data.result, ...unbondedData.result, ...unbondingData.result]
      // result.sort((a, b) => b.tokens - a.tokens);
      let validators = []
      await result.reduce(async (memo, i, index) => {
        await memo;
        if (isMy) {
          const owner = await context.dispatch("fetchValidatorOwner", i.operator_address)
          validators.push({
            ...i,
            owner,
            index: index + 1
          })
        } else {
          validators.push({
            ...i,
            index: index + 1
          })
        }
      }, undefined)
      context.commit(
        'setValidators',
        validators
      );
      const validatorMap = {};
      result.forEach(v => {
        validatorMap[v.operator_address] = v;
      });

      context.commit('setValidatorMap', validatorMap);
      return Promise.resolve(result);
    },
    fetchValidatorOwner: async function (context, address) {
      const {
        data
      } = await ajax.get(`/distribution/validators/${address}`);
      context.commit("setDistributionMap", {
        [address]: data
      })
      return Promise.resolve(data.result.operator_address)
    },
    fetchValidator: async function (context, validator_addr) {
      const {
        data
      } = await ajax.get(`/staking/validators/${validator_addr}`);
      if (isEmpty(data)) {
        return Promise.reject();
      }
      context.commit('setValidatorMap', {
        [validator_addr]: data.result
      });
      context.dispatch("fetchValidatorOwner", validator_addr)
      return Promise.resolve(data);
    },
    setToValidator: async function (context, validator) {
      context.commit('setToValidator', validator);
      return Promise.resolve();
    },
    setFromValidator: async function (context, validator) {
      context.commit('setFromValidator', validator);
      return Promise.resolve();
    },
    setForm: async function (context, form) {
      context.commit('setForm', form);
      return Promise.resolve();
    },
    delegate: async function (context, {
      pass
    }) {
      const {
        form: {
          amount
        },
        toValidator: {
          operator_address
        }
      } = context.state;
      const msg = {
        validator_addr: operator_address,
        delegation: {
          denom: 'uif',
          amount: BigNumber(amount)
            .times(BigNumber(10).pow(6))
            .toFixed()
        }
      };
      const {
        data
      } = await sendTx(context, pass, 'delegate', msg);
      return Promise.resolve(data);
    },
    unbind: async function (context, {
      pass
    }) {
      const {
        form: {
          amount
        },
        fromValidator: {
          operator_address
        }
      } = context.state;
      const msg = {
        validator_addr: operator_address,
        amount: {
          denom: 'uif',
          amount: BigNumber(amount)
            .times(BigNumber(10).pow(6))
            .toFixed()
        }
      };
      const {
        data
      } = await sendTx(context, pass, 'undelegate', msg);
      return Promise.resolve(data);
    },
    redelegate: async function (context, {
      pass
    }) {
      const {
        form: {
          amount
        },
        fromValidator,
        toValidator
      } = context.state;
      const msg = {
        amount: {
          denom: 'uif',
          amount: BigNumber(amount)
            .times(BigNumber(10).pow(6))
            .toFixed()
        },
        validator_src_addr: fromValidator.operator_address,
        validator_dst_addr: toValidator.operator_address
      };
      const {
        data
      } = await sendTx(context, pass, 'begin_redelegate', msg);
      return Promise.resolve(data);
    },
    withdrawAll: async function (context, {
      pass
    }) {
      const msgs = context.state.delegations.map(i => {
        return {
          validator_addr: i.validator_address
        };
      });
      const {
        data
      } = await sendTx(context, pass, 'withdraw_delegation_rewards_all', {}, msgs);
      return Promise.resolve(data);
    },
    withdraw: async function (context, params) {
      const address = context.rootGetters['account/currentAddress'];
      const msgs = {
        "type": "cosmos-sdk/MsgWithdrawDelegationReward",
        "value": {
          "delegator_address": address,
          "validator_address": params.validator_address
        }
      }
      const {
        data
      } = await sendTx(context, params.pass, 'withdraw_delegator_reward', {}, msgs);
      return Promise.resolve(data);
    },
    async fetchAddressRedelegations(context) {
      const address = context.rootGetters['account/currentAddress'];
      const {
        data
      } = await ajax.get(`/staking/redelegations?delegator=${address}`);
      if (isEmpty(data)) {
        throw new Error();
      }
      let result = []
      data.result.forEach(i => {
        i.entries.forEach(m => {
          result.push({
            entries: m,
            delegator_address: i.delegator_address,
            validator_dst_address: i.validator_dst_address,
            validator_src_address: i.validator_src_address
          })
        })
      })
      context.commit('setAddressRedelegations', result)
    }
  }
};