// @flow
import createCommunity from './createCommunity';
import deleteCommunity from './deleteCommunity';
import editCommunity from './editCommunity';
import toggleCommunityMembership from './toggleCommunityMembership';
import sendSlackInvites from './sendSlackInvites';
import sendEmailInvites from './sendEmailInvites';
import pinThread from './pinThread';
import addCommunityMember from './addCommunityMember';
import removeCommunityMember from './removeCommunityMember';
import addCommunityModerator from './addCommunityModerator';
import removeCommunityModerator from './removeCommunityModerator';
import blockCommunityMember from './blockCommunityMember';
import unblockCommunityMember from './unblockCommunityMember';

module.exports = {
  Mutation: {
    createCommunity,
    deleteCommunity,
    editCommunity,
    toggleCommunityMembership,
    sendSlackInvites,
    sendEmailInvites,
    pinThread,
    addCommunityMember,
    removeCommunityMember,
    addCommunityModerator,
    removeCommunityModerator,
    blockCommunityMember,
    unblockCommunityMember,
  },
};
