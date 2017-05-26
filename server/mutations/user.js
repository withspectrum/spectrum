// @flow
import { uploadPhoto, editUser } from '../models/user';
import type { EditUserArguments } from '../models/user';
// $FlowFixMe
import { UserError } from 'graphql-errors';

module.exports = {
  Mutation: {
    uploadProfilePhoto: (_: any, { file }, { user }) => uploadPhoto(file, user),
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
  },
};
