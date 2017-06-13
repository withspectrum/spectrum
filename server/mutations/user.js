// @flow
import { editUser, setUserLastSeen } from '../models/user';
import type { EditUserArguments } from '../models/user';
// $FlowFixMe
import UserError from '../utils/UserError';

module.exports = {
  Mutation: {
    editUser: (_, args: EditUserArguments, { user }) => {
      const currentUser = user;

      // user must be authed to edit a channel
      if (!currentUser) {
        return new UserError(
          'You must be signed in to make changes to this profile.'
        );
      }

      return editUser(args, currentUser.id);
    },
    setUserLastSeen: (_, __, { user }) => {
      if (!user) return;
      return setUserLastSeen(user.id);
    },
  },
};
