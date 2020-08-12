import Vue from 'vue';
import Vuex from 'vuex';
import ElementUI from 'element-ui';
import VueI18n from 'vue-i18n';
import VueClipboard from 'vue-clipboard2';
import '@/styles/element-variables.scss';
import echarts from 'echarts';
import App from './App.vue';
import router from './router';

import {
  library
} from '@fortawesome/fontawesome-svg-core';
import {
  faTelegramPlane,
  faTwitter,
  faMedium,
  faRedditAlien,
  faLinkedin,
  faFacebook,
  faWeibo,
  faWeixin
} from '@fortawesome/free-brands-svg-icons';
import {
  FontAwesomeIcon
} from '@fortawesome/vue-fontawesome';

import {
  en,
  zh
} from '@/constants';
import * as filters from '@/utils/filters.js';
import rootStore from './store/index.js';

import Link from '@/components/Link';
import Page from '@/components/Page';
import Card from '@/components/Card';
import DataItem from '@/components/DataItem';
import BtnPanel from '@/components/Panel/BtnPanel.vue';
import AddressCopy from '@/components/AddressCopy';
import DataAmount from '@/components/Amount';

Vue.config.productionTip = false;

Vue.prototype.$echarts = echarts

Vue.use(VueI18n);
const lang = localStorage.getItem('lang') || window.navigator.language || window.navigator.userLanguage;
const i18n = new VueI18n({
  locale: lang.match('zh') ? 'zh' : 'en',
  messages: {
    en,
    zh
  }
});

Vue.use(ElementUI);
Vue.use(Vuex);
Vue.use(VueClipboard);
Object.keys(filters).forEach(key => Vue.filter(key, filters[key]));

const store = new Vuex.Store(rootStore);

// get blockchain basic info
store.dispatch('transactions/getNodeInfo');

// 注册全局组件
library.add(faTelegramPlane, faTwitter, faMedium, faRedditAlien, faLinkedin, faFacebook, faWeibo, faWeixin);
Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.component('s-page', Page);
Vue.component('s-card', Card);
Vue.component('s-item', DataItem);
Vue.component('s-link', Link);
Vue.component('s-btn-card', BtnPanel);
Vue.component('s-address', AddressCopy);
Vue.component('data-amount', DataAmount)

router.beforeEach((to, from, next) => {
  store.commit("account/setDrawer", false)
  next()
})
new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app');