// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { getInvoicesByUser } from '../../models/invoice';

export default (_: any, __: any, { user }: GraphQLContext) => {
  const currentUser = user;
  if (!currentUser)
    return new UserError('You must be logged in to view these settings.');

  return getInvoicesByUser(currentUser.id);
};
