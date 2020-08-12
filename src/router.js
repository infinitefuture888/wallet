import Vue from 'vue';
import Router from 'vue-router';
import NotFound from './views/NotFound.vue';
import Home from './views/Home.vue';
import Agree from './views/Agree.vue';
import Passport from './views/Passport.vue';
import Create from './views/Create/index.vue';
import CreatePass from './views/Create/password.vue';
import CreateMnem from './views/Create/mnemonic.vue';
import CreateConfirm from './views/Create/confirm.vue';
import Recover from './views/Recover.vue';
import RecoverKeyText from '@/components/Recover/KeyText/KeyInput.vue';
import RecoverKeyFile from '@/components/Recover/KeyFile/KeyUpload.vue';
import RecoverKeySubmit from '@/components/Recover/KeyText/KeySubmit.vue';
import RecoverPhraseText from '@/components/Recover/Phrase/PhraseInput.vue';
import RecoverPhraseSubmit from '@/components/Recover/Phrase/PhraseSubmit.vue';

import Main from './views/Main.vue';
import TxInfo from '@/components/TransactionInfo/index.vue';
import Txs from './views/Txs.vue';
import Send from './views/Send.vue';
import SendForm from '@/components/Send/SendForm.vue';
import SendConfirm from '@/components/Send/SendConfirm.vue';
import SendFinish from '@/components/Send/SendFinish.vue';
import Receive from './views/Receive.vue';
import SingleTokenAssets from './views/SingleTokenAssets.vue';

import StakingMain from './views/StakingMain.vue';
import Staking from './views/Staking.vue';
import DelegateForm from '@/components/Staking/DelegateForm.vue';
import ValidatorList from '@/components/Staking/ValidatorList.vue';
import DelegateConfirm from '@/components/Staking/Confirm.vue';
import DelegateDetail from '@/components/Staking/DelegateDetail.vue';
import UnbindForm from '@/components/Staking/UnbindForm.vue';
import RedelegateForm from '@/components/Staking/RedelegateForm.vue';


import Vote from '@/components/Vote/index.vue';
import VoteCreat from '@/components/Vote/creat.vue';
import VoteList from '@/components/Vote/list.vue';
import VoteDetail from '@/components/Vote/detail.vue';

import RedelegateDetail from "./views/RedelegateDetail.vue"

import MyNode from "@/components/MyValidators/index.vue"
import MyNodeDetail from "@/components/MyValidators/detail.vue"
import MyNodeEdit from "@/components/MyValidators/edit.vue"
import MyWithdraw from "@/components/MyValidators/setWithdraw.vue"

import UseInfo from "./views/UseInfo.vue"
import PrivacyInfo from "./views/PrivacyInfo.vue"
// 
// 解决两次访问相同路由地址报错
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};

Vue.use(Router);
export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [{
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'home',
      component: Home
    },
    {
      path: '/agree',
      name: 'agree',
      component: Agree
    },
    {
      path: '/privacyInfo',
      name: 'privacyInfo',
      component: PrivacyInfo
    },
    {
      path: '/useInfo',
      name: 'useInfo',
      component: UseInfo
    },
    {
      path: '/passport',
      name: 'passport',
      component: Passport
    },
    {
      path: '/create',
      name: 'create',
      component: Create,
      children: [{
          path: 'pass',
          component: CreatePass
        },
        {
          path: 'mnemonic',
          component: CreateMnem
        },
        {
          path: 'confirm',
          component: CreateConfirm
        }
      ]
    },
    {
      path: '/recover',
      name: 'recover',
      component: Recover,
      children: [{
          path: 'key/text',
          component: RecoverKeyText
        },
        {
          path: 'key/submit',
          component: RecoverKeySubmit
        },
        {
          path: 'key/file',
          component: RecoverKeyFile
        },
        {
          path: 'phrase/input',
          component: RecoverPhraseText
        },
        {
          path: 'phrase/submit',
          component: RecoverPhraseSubmit
        }
      ]
    },
    {
      path: '/main',
      name: 'main',
      component: Main
    },
    {
      path: '/SingleTokenAssets',
      name: 'SingleTokenAssets',
      component: SingleTokenAssets
    },
    {
      path: '/txs',
      name: 'txs',
      component: Txs
    },
    {
      path: '/tx/:id',
      name: 'tx',
      component: TxInfo
    },
    {
      path: '/send',
      name: 'send',
      component: Send,
      children: [{
          path: 'form',
          component: SendForm
        },
        {
          path: 'confirm',
          component: SendConfirm
        },
        {
          path: 'finish',
          component: SendFinish
        }
      ]
    },
    {
      path: '/receive',
      name: 'receive',
      component: Receive
    },
    {
      path: '/redelegateDetail',
      component: RedelegateDetail
    },
    {
      path: '/staking',
      component: StakingMain
    },
    {
      path: '/staking',
      name: 'staking',
      component: Staking,
      children: [{
          path: 'delegate',
          component: DelegateForm
        },
        {
          path: 'validator',
          component: ValidatorList
        },
        {
          path: 'confirm',
          component: DelegateConfirm
        },
        {
          path: 'detail/:validator',
          component: DelegateDetail
        },
        {
          path: 'unbind',
          component: UnbindForm
        },
        {
          path: 'redelegate',
          component: RedelegateForm
        }
      ]
    },
    {
      path: '/vote',
      name: 'vote',
      component: Vote,
      children: [{
          path: 'creat',
          name: 'voteCreat',
          component: VoteCreat
        },
        {
          path: 'list',
          name: 'voteList',
          component: VoteList
        },
        {
          path: 'detail/:id',
          name: 'voteDetail',
          component: VoteDetail
        }
      ]
    },
    {
      path: '/myNode',
      component: MyNode,
      children: [{
        path: 'detail',
        component: MyNodeDetail
      }, {
        path: 'edit',
        component: MyNodeEdit
      }, {
        path: 'withdraw',
        component: MyWithdraw
      }]
    },
    {
      path: '*',
      name: 'notFound',
      component: NotFound
    }
  ]
});