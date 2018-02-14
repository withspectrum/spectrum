// @flow
import { getInvoicesByCustomerId } from '../../models/stripeInvoices';
import { getSourcesByCustomerId } from '../../models/stripeSources';
import { getSubscriptionsByCustomerId } from '../../models/stripeSubscriptions';
import type { GraphQLContext } from '../..';
import type { DBCommunity } from 'shared/types';

export default async (
  {
    id,
    pendingAdministratorEmail,
    administratorEmail,
    stripeCustomerId,
  }: DBCommunity,
  _: any,
  { user, loaders }: GraphQLContext
) => {
  const { isOwner } = await loaders.userPermissionsInCommunity.load([
    user.id,
    id,
  ]);
  return {
    pendingAdministratorEmail: isOwner ? pendingAdministratorEmail : null,
    administratorEmail: isOwner ? administratorEmail : null,
    sources: isOwner ? await getSourcesByCustomerId(stripeCustomerId) : [],
    invoices: isOwner ? await getInvoicesByCustomerId(stripeCustomerId) : [],
    subscriptions: isOwner
      ? await getSubscriptionsByCustomerId(stripeCustomerId)
      : [],
  };
};
