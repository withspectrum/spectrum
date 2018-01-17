// @flow
import type { GraphQLContext } from '../../';
import type { EditUserInput } from '../../models/user';
import UserError from '../../utils/UserError';
import { getUser, editUser } from '../../models/user';

export default (_: any, args: EditUserInput, { user }: GraphQLContext) => {
  const currentUser = user;

  // user must be authed to edit a channel
  if (!currentUser) {
    return new UserError(
      'You must be signed in to make changes to this profile.'
    );
  }

  // if the user is changing their username, check for uniqueness on the server
  if (args.input.username) {
    if (args.input.username === 'null' || args.input.username === 'undefined') {
      throw new UserError('Nice try! 😉');
    }
    return getUser({ username: args.input.username }).then(user => {
      // no user exists
      if (!user) return editUser(args, currentUser.id);
      // if the user is saving themselves, it's safe to edit
      if (user.id === currentUser.id) return editUser(args, currentUser.id);
      return new UserError(
        'Looks like that username got swooped! Try another?'
      );
    });
  } else {
    return editUser(args, currentUser.id);
  }
};
