// @flow
import createCommunity from './createCommunity';
import deleteCommunity from './deleteCommunity';
import editCommunity from './editCommunity';
import toggleCommunityMembership from './toggleCommunityMembership';
import sendSlackInvites from './sendSlackInvites';
import sendEmailInvites from './sendEmailInvites';
import pinThread from './pinThread';
import updateAdministratorEmail from './updateAdministratorEmail';
import addPaymentSource from './addPaymentSource';
import removePaymentSource from './removePaymentSource';
import makePaymentSourceDefault from './makePaymentSourceDefault';
import cancelSubscription from './cancelSubscription';
import enableCommunityAnalytics from './enableCommunityAnalytics';
import disableCommunityAnalytics from './disableCommunityAnalytics';
import enableBrandedLogin from './enableBrandedLogin';
import disableBrandedLogin from './disableBrandedLogin';
import saveBrandedLoginSettings from './saveBrandedLoginSettings';
import importSlackMembers from './importSlackMembers';

module.exports = {
  Mutation: {
    createCommunity,
    deleteCommunity,
    editCommunity,
    toggleCommunityMembership,
    sendSlackInvites,
    sendEmailInvites,
    pinThread,
    updateAdministratorEmail,
    addPaymentSource,
    removePaymentSource,
    makePaymentSourceDefault,
    cancelSubscription,
    enableCommunityAnalytics,
    disableCommunityAnalytics,
    enableBrandedLogin,
    disableBrandedLogin,
    saveBrandedLoginSettings,
    importSlackMembers,
  },
};
