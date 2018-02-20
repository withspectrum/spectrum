// @flow
import { getInvoicesByCustomerId } from '../../models/stripeInvoices';
import { StripeUtil } from 'shared/stripe/utils';
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
  const defaultResult = {
    pendingAdministratorEmail,
    administratorEmail,
    sources: [],
    invoices: [],
    subscriptions: [],
  };

  if (!stripeCustomerId) return defaultResult;

  const [permissions, { reduction }] = await Promise.all([
    loaders.userPermissionsInCommunity.load([user.id, id]),
    loaders.stripeCustomers.load(stripeCustomerId),
  ]);

  const { isOwner } = permissions;
  const customer = reduction.length === 0 ? null : reduction[0];
  const sources =
    isOwner && customer ? await StripeUtil.getSources(customer) : [];
  const invoices =
    isOwner && customer ? await getInvoicesByCustomerId(stripeCustomerId) : [];
  const subscriptions =
    isOwner && customer
      ? await StripeUtil.cleanSubscriptions(customer).filter(
          sub => sub && sub.items.length >= 1
        )
      : [];

  return {
    pendingAdministratorEmail: isOwner ? pendingAdministratorEmail : null,
    administratorEmail: isOwner ? administratorEmail : null,
    sources: sources,
    invoices: invoices,
    subscriptions: subscriptions,
  };
};
