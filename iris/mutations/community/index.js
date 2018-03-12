// @flow
import createCommunity from './createCommunity';
import deleteCommunity from './deleteCommunity';
import editCommunity from './editCommunity';
import toggleCommunityMembership from './toggleCommunityMembership';
import sendSlackInvites from './sendSlackInvites';
import sendEmailInvites from './sendEmailInvites';
import pinThread from './pinThread';
import enableBrandedLogin from './enableBrandedLogin';
import disableBrandedLogin from './disableBrandedLogin';
import saveBrandedLoginSettings from './saveBrandedLoginSettings';

module.exports = {
  Mutation: {
    createCommunity,
    deleteCommunity,
    editCommunity,
    toggleCommunityMembership,
    sendSlackInvites,
    sendEmailInvites,
    pinThread,
    enableBrandedLogin,
    disableBrandedLogin,
    saveBrandedLoginSettings,
  },
};
