import account from './modules/account.js';
import recover from './modules/recover.js';
import transactions from './modules/transactions.js';
import staking from './modules/staking.js';

import basic from './modules/basic.js';
import gov from './modules/gov.js';
import migrate from './modules/migrate.js'
export default {
  modules: {
    account,
    recover,
    transactions,
    staking,
    basic,
    gov,
    migrate
  }
};