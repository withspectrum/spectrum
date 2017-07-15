// @flow
import { editUser, getUsers, getUser } from '../models/user';
import type { EditUserArguments } from '../models/user';
import {
  getUsersSettings,
  updateUsersNotificationSettings,
} from '../models/usersSettings';
// $FlowFixMe
import UserError from '../utils/UserError';

type ToggleNotificationsArguments = {
  deliveryMethod: string,
  notificationType: string,
};

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

      // if the user is changing their username, check for uniqueness on the server
      if (args.input.username) {
        if (
          args.input.username === 'null' ||
          args.input.username === 'undefined'
        ) {
          throw new UserError('Nice try! 😉');
        }
        return getUser({ username: args.input.username }).then(user => {
          // no user exists
          if (!user) return editUser(args, currentUser.id);
          return new UserError(
            'Looks like that username got swooped! Try another?'
          );
        });
      } else {
        return editUser(args, currentUser.id);
      }
    },
    toggleNotificationSettings: (
      _,
      { input }: { input: ToggleNotificationsArguments },
      { user }
    ) => {
      const currentUser = user;

      if (!currentUser) {
        return new UserError(
          'You must be signed in to make changes to this profile.'
        );
      }

      return getUsersSettings(currentUser.id)
        .then(settings => {
          let newSettings = Object.assign({}, settings, {
            ...settings,
          });
          let oldVal =
            settings.notifications.types[input.notificationType][
              input.deliveryMethod
            ];
          newSettings['notifications']['types'][input.notificationType][
            input.deliveryMethod
          ] = !oldVal;

          return updateUsersNotificationSettings(currentUser.id, newSettings);
        })
        .then(() => getUsers([currentUser.id]).then(users => users[0]));
    },
  },
};
