// @flow
import createCommunity from './createCommunity';
import deleteCommunity from './deleteCommunity';
import editCommunity from './editCommunity';
import toggleCommunityMembership from './toggleCommunityMembership';
import sendSlackInvites from './sendSlackInvites';
import sendEmailInvites from './sendEmailInvites';
import pinThread from './pinThread';

module.exports = {
  Mutation: {
    createCommunity,
    deleteCommunity,
    editCommunity,
    toggleCommunityMembership,
    sendSlackInvites,
    sendEmailInvites,
    pinThread,
  },
};
