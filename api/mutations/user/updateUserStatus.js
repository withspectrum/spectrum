// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { updateUserStatus } from '../../models/user';
import Raven from 'shared/raven';

import type { UserStatus } from 'shared/graphql/fragments/user/userInfo';

export default async (
  _: any,
  { status }: { status: UserStatus },
  { user }: GraphQLContext
) => {
  const currentUser = user;

  return updateUserStatus(user.id, status).catch(err => {
    console.error(err);
    Raven.captureException(err);
  });
};
