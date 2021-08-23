// @flow
import deleteCommunity from './deleteCommunity';
import editCommunity from './editCommunity';
import toggleCommunityRedirect from './toggleCommunityRedirect';
import toggleCommunityNoindex from './toggleCommunityNoindex.js';

module.exports = {
  Mutation: {
    deleteCommunity,
    editCommunity,
    toggleCommunityRedirect,
    toggleCommunityNoindex,
  },
};
