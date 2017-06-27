//@flow
// $FlowFixMe
import UserError from '../utils/UserError';
import { isAdmin } from '../utils/permissions';
import { saveUserCommunityPermissions } from '../models/meta';

module.exports = {
  Mutation: {
    saveUserCommunityPermissions: (_, { input }, { user }) => {
      const currentUser = user;
      if (!isAdmin(currentUser.id)) {
        return new UserError('Failure');
      }
      const { id, ...permissions } = input;
      const userId = currentUser.id;
      const communityId = id;
      saveUserCommunityPermissions(permissions, userId, communityId);
    },
  },
};
