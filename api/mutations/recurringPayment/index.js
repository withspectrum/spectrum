// @flow
import upgradeToPro from './upgradeToPro';
import downgradeFromPro from './downgradeFromPro';
import upgradeCommunity from './upgradeCommunity';
import downgradeCommunity from './downgradeCommunity';

module.exports = {
  Mutation: {
    upgradeToPro,
    downgradeFromPro,
    upgradeCommunity,
    downgradeCommunity,
  },
};
