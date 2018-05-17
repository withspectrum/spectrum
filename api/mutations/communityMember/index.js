// @flow
import addCommunityMember from './addCommunityMember';
import addPendingCommunityMember from './addPendingCommunityMember';
import removeCommunityMember from './removeCommunityMember';
import removePendingCommunityMember from './removePendingCommunityMember';
import addCommunityModerator from './addCommunityModerator';
import approvePendingCommunityMember from './approvePendingCommunityMember';
import removeCommunityModerator from './removeCommunityModerator';
import blockCommunityMember from './blockCommunityMember';
import blockPendingCommunityMember from './blockPendingCommunityMember';
import unblockCommunityMember from './unblockCommunityMember';

module.exports = {
  Mutation: {
    addCommunityMember,
    addPendingCommunityMember,
    removeCommunityMember,
    removePendingCommunityMember,
    addCommunityModerator,
    approvePendingCommunityMember,
    removeCommunityModerator,
    blockCommunityMember,
    blockPendingCommunityMember,
    unblockCommunityMember,
  },
};
