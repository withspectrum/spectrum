// @flow
import type { GraphQLContext } from '../../';
import {
  getUsersSettings,
  updateUsersNotificationSettings,
} from '../../models/usersSettings';
import { getUserById } from 'shared/db/queries/user';
import { isAuthedResolver as requireAuth } from '../../utils/permissions';

type Input = {
  input: {
    deliveryMethod: string,
    notificationType: string,
  },
};

export default requireAuth(async (_: any, args: Input, ctx: GraphQLContext) => {
  const { user } = ctx;
  const { deliveryMethod, notificationType } = args.input;

  // eslint-disable-next-line
  const { id, ...settings } = await getUsersSettings(user.id);

  // destructure the notifications so we don't pass the id into the model downstream
  // trying to update a primary key 'id' will throw a reql error
  let newSettings = Object.assign({}, settings, {
    ...settings,
  });

  let oldVal = settings.notifications.types[notificationType][deliveryMethod];
  newSettings['notifications']['types'][notificationType][
    deliveryMethod
  ] = !oldVal;

  return await updateUsersNotificationSettings(
    user.id,
    newSettings,
    notificationType,
    deliveryMethod,
    oldVal
  ).then(() => getUserById(user.id));
});
