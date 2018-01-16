// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import {
  getUsersSettings,
  updateUsersNotificationSettings,
} from '../../models/usersSettings';
import { getUserById } from '../../models/user';

type ToggleNotificationsArguments = {
  deliveryMethod: string,
  notificationType: string,
};

export default async (
  _: any,
  { input }: { input: ToggleNotificationsArguments },
  { user }: GraphQLContext
) => {
  const currentUser = user;

  if (!currentUser) {
    return new UserError(
      'You must be signed in to make changes to this profile.'
    );
  }

  // eslint-disable-next-line
  const { id, ...settings } = await getUsersSettings(currentUser.id);

  // destructure the notifications so we don't pass the id into the model downstream
  // trying to update a primary key 'id' will throw a reql error
  let newSettings = Object.assign({}, settings, {
    ...settings,
  });

  let oldVal =
    settings.notifications.types[input.notificationType][input.deliveryMethod];
  newSettings['notifications']['types'][input.notificationType][
    input.deliveryMethod
  ] = !oldVal;

  return updateUsersNotificationSettings(currentUser.id, newSettings).then(() =>
    getUserById(currentUser.id)
  );
};
