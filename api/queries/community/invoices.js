// @flow
import type { DBCommunity } from 'shared/types';
import type { GraphQLContext } from '../../';
import { getInvoicesByCommunity } from '../../models/invoice';
import UserError from '../../utils/UserError';

export default ({ id }: DBCommunity, _: any, { user }: GraphQLContext) => {
  const currentUser = user;
  if (!currentUser)
    return new UserError('You must be logged in to view community settings.');

  return getInvoicesByCommunity(id);
};
