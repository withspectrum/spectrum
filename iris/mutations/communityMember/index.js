// @flow
import addCommunityMember from './addCommunityMember';
import removeCommunityMember from './removeCommunityMember';
import addCommunityModerator from './addCommunityModerator';
import removeCommunityModerator from './removeCommunityModerator';
import blockCommunityMember from './blockCommunityMember';
import unblockCommunityMember from './unblockCommunityMember';

module.exports = {
  Mutation: {
    addCommunityMember,
    removeCommunityMember,
    addCommunityModerator,
    removeCommunityModerator,
    blockCommunityMember,
    unblockCommunityMember,
  },
};
