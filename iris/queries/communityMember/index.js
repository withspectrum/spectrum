// @flow
import communityMember from './rootCommunityMember';
import user from './user';
import roles from './roles';

module.exports = {
  Query: {
    communityMember,
  },
  CommunityMember: {
    user,
    roles,
  },
};
