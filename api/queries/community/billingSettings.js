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

  const [permissions, stripeCustomer] = await Promise.all([
    loaders.userPermissionsInCommunity.load([user.id, id]),
    loaders.stripeCustomers.load(stripeCustomerId),
  ]);

  if (!permissions) return defaultResult;

  const { isOwner, isModerator } = permissions;
  const customer =
    stripeCustomer && stripeCustomer.reduction.length > 0
      ? stripeCustomer.reduction[0]
      : null;
  const sources =
    (isOwner || isModerator) && customer
      ? await StripeUtil.getSources(customer)
      : [];
  const invoices =
    isOwner && customer ? await getInvoicesByCustomerId(stripeCustomerId) : [];
  const cleanInvoices = StripeUtil.cleanInvoices(invoices);
  let subscriptions =
    isOwner && customer ? await StripeUtil.cleanSubscriptions(customer) : [];
  subscriptions =
    subscriptions.length > 0
      ? subscriptions.filter(sub => sub && sub.items.length >= 1)
      : subscriptions;

  return {
    pendingAdministratorEmail:
      isOwner || isModerator ? pendingAdministratorEmail : null,
    administratorEmail: isOwner || isModerator ? administratorEmail : null,
    sources: sources,
    invoices: cleanInvoices,
    subscriptions: subscriptions,
  };
};
