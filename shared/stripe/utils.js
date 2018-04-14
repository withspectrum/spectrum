// @flow
const debug = require('debug')('pluto:queues:stripe-util');
import { stripe } from 'shared/stripe';
import type { RawCustomer } from 'shared/stripe/types/customer';
import type { RawSubscription } from 'shared/stripe/types/subscription';
import type { DBCommunity } from 'shared/types';
import type { RawSubscriptionItem } from 'shared/stripe/types/subscriptionItem';
import type { RawSource } from 'shared/stripe/types/source';
import type { RawInvoice } from 'shared/stripe/types/invoice';
import { getCommunityById, setStripeCustomerId } from 'api/models/community';
import {
  FREE_MODERATOR_SEAT,
  MODERATOR_SEAT,
  FREE_PRIVATE_CHANNEL,
  PRIVATE_CHANNEL,
  COMMUNITY_FEATURES,
  COMMUNITY_ANALYTICS,
} from 'pluto/queues/constants';

const getCustomer = async (customerId: string): Promise<RawCustomer> => {
  return await stripe.customers.retrieve(customerId);
};

const hasChargeableSource = (customer: RawCustomer): boolean => {
  if (!customer) return false;
  if (!customer.sources || customer.sources.data.length === 0) return false;
  return customer.sources.data.some(
    source => source && source.status === 'chargeable'
  );
};

const getChargeableSource = (customer: RawCustomer): ?RawSource => {
  if (!customer) return null;
  if (!customer.sources || customer.sources.data.length === 0) return null;
  return customer.sources.data.find(
    source => source && source.status === 'chargeable'
  );
};

const getSources = (
  customer: RawCustomer
): Array<?{
  ...$Exact<RawSource>,
  isDefault: boolean,
}> => {
  if (!customer) return [];
  if (!customer.sources || customer.sources.data.length === 0) return [];

  return customer.sources.data.map(source => {
    if (!source) return null;
    return Object.assign({}, source, {
      isDefault: source.id === customer.default_source,
    });
  });
};

type AttachNewSourceInput = {
  customerId: string,
  sourceId: string,
};
// prettier-ignore
const attachNewSource = async (input: AttachNewSourceInput): Promise<RawSource> => {
  const { customerId, sourceId } = input;
  return await stripe.customers.createSource(customerId, {
    source: sourceId,
  });
};

type DetachSourceInput = {
  customerId: string,
  sourceId: string,
};
const detachSource = async (input: DetachSourceInput): Promise<RawCustomer> => {
  const { customerId, sourceId } = input;
  return await stripe.customers.deleteSource(customerId, sourceId);
};

type ChangeDefaultSourceInput = {
  customerId: string,
  sourceId: string,
};
// prettier-ignore
const changeDefaultSource = async (input: ChangeDefaultSourceInput): Promise<RawCustomer> => {
  const { customerId, sourceId } = input;
  return await stripe.customers.update(customerId, {
    default_source: sourceId,
  });
};

const hasActiveSubscription = (customer: RawCustomer): boolean => {
  if (!customer) return false;
  if (!customer.subscriptions || customer.subscriptions.data.length === 0)
    return false;
  return customer.subscriptions.data.some(
    sub => sub && sub.status === 'active'
  );
};

const getActiveSubscription = (customer: RawCustomer): ?RawSubscription => {
  if (!customer) return null;
  if (!customer.subscriptions || customer.subscriptions.data.length === 0)
    return null;
  return customer.subscriptions.data.find(
    sub => sub && sub.status === 'active'
  );
};

const getSubscriptions = (customer: RawCustomer): Array<?RawSubscription> => {
  if (!customer) return [];
  if (!customer.subscriptions || customer.subscriptions.data.length === 0)
    return [];
  return customer.subscriptions.data;
};

const hasSubscriptionItemOfType = (
  customer: RawCustomer,
  type: string
): boolean => {
  if (!customer) return false;
  const activeSubscription = getActiveSubscription(customer);
  if (!activeSubscription) return false;
  return activeSubscription.items.data.some(
    item => item && item.plan.id === type
  );
};

type SubscriptionItemTypes =
  | typeof FREE_MODERATOR_SEAT
  | typeof MODERATOR_SEAT
  | typeof FREE_PRIVATE_CHANNEL
  | typeof PRIVATE_CHANNEL
  | typeof COMMUNITY_ANALYTICS
  | typeof COMMUNITY_FEATURES;

// prettier-ignore
const getSubscriptionItemOfType = (customer: RawCustomer, type: SubscriptionItemTypes): ?RawSubscriptionItem => {
  if (!customer) return null;
  const activeSubscription = getActiveSubscription(customer);
  if (!activeSubscription) return null;
  return activeSubscription.items.data.find(
    item => item && item.plan.id === type
  );
};

type CreateCustomerInput = {
  administratorEmail: ?string,
  communityId: string,
  communityName: string,
};
type CreateCustomerOutput = {
  customer: RawCustomer,
  community: DBCommunity,
};
// prettier-ignore
const createCustomer = async (customerInput: CreateCustomerInput): Promise<CreateCustomerOutput> => {
  const customer = await stripe.customers.create({
    email: customerInput.administratorEmail,
    metadata: {
      communityId: customerInput.communityId,
      communityName: customerInput.communityName,
    },
  });

  const community = await setStripeCustomerId(
    customerInput.communityId,
    customer.id
  );

  return {
    customer,
    community,
  };
};

const deleteCustomer = async (customerId: string) => {
  return await stripe.customers.del(customerId);
};

type UpdateCustomerInput = {
  customerId: string,
  administratorEmail: ?string,
  communityId: string,
  communityName: string,
};
const updateCustomer = async (customerInput: UpdateCustomerInput) => {
  return await stripe.customers.update(customerInput.customerId, {
    email: customerInput.administratorEmail,
    metadata: {
      communityId: customerInput.communityId,
      communityName: customerInput.communityName,
    },
  });
};

type FirstSubInput = {
  customerId: string,
  subscriptionItemType: SubscriptionItemTypes,
};
const createFirstSubscription = async (input: FirstSubInput) => {
  const { customerId, subscriptionItemType } = input;
  return await stripe.subscriptions.create({
    customer: customerId,
    items: [
      // NOTE: We have to include this dummy item in order to prevent
      // the top-level subscription from thinking it's about any
      // specific feature
      {
        plan: COMMUNITY_FEATURES,
        quantity: 1,
      },
      {
        plan: subscriptionItemType,
        quantity: 1,
      },
    ],
  });
};

// given subscriptions returned from a StripeCustomers record in our db,
// we reformat the data to be more front-end friendly
const cleanSubscriptions = (customer: RawCustomer): Array<?Object> => {
  const subscriptions = getSubscriptions(customer);
  if (!subscriptions || subscriptions.length === 0) return [];

  const formatItems = (items: Array<any>) => {
    if (!items || items.length === 0) return [];
    return items
      .filter(item => item && item.plan.id !== COMMUNITY_FEATURES)
      .map(
        item =>
          item && {
            created: item.created,
            planId: item.plan.id,
            planName: item.plan.name,
            amount: item.plan.amount,
            quantity: item.quantity,
            id: item.id,
          }
      );
  };

  return subscriptions.map(
    sub =>
      sub && {
        id: sub.id,
        created: sub.created,
        current_period_end: sub.current_period_end,
        discount: sub.discount
          ? {
              amount_off: sub.discount.coupon.amount_off,
              percent_off: sub.discount.coupon.percent_off,
              id: sub.discount.coupon.id,
            }
          : customer.discount
            ? {
                amount_off: customer.discount.coupon.amount_off,
                percent_off: customer.discount.coupon.percent_off,
                id: customer.discount.coupon.id,
              }
            : null,
        billing_cycle_anchor: sub.billing_cycle_anchor,
        canceled_at: sub.canceled_at,
        items: formatItems(sub.items.data),
        status: sub.status,
      }
  );
};

const cleanInvoices = (invoices: Array<?RawInvoice>) => {
  if (!invoices || invoices.length === 0) return [];

  const cleanInvoiceItems = items => {
    return items.map(
      item =>
        item && {
          id: item.id,
          amount: item.plan.amount,
          quantity: item.quantity,
          planId: item.plan.id,
          planName: item.plan.name,
        }
    );
  };

  return invoices
    .map(
      invoice =>
        invoice && {
          id: invoice.id,
          date: invoice.date,
          items: cleanInvoiceItems(invoice.lines.data),
          total: invoice.total,
        }
    )
    .filter(invoice => invoice && invoice.total > 0);
};

type AddSIInput = {
  subscriptionId: string,
  subscriptionItemType: SubscriptionItemTypes,
};
const addSubscriptionItem = async (input: AddSIInput) => {
  const { subscriptionId, subscriptionItemType } = input;

  return await stripe.subscriptionItems.create({
    subscription: subscriptionId,
    plan: subscriptionItemType,
    quantity: 1,
    prorate: true,
  });
};

type UpdateSIInput = {
  subscriptionItemId: string,
  quantity: number,
};
const updateSubscriptionItem = async (input: UpdateSIInput) => {
  const { subscriptionItemId, quantity } = input;

  return await stripe.subscriptionItems.update(subscriptionItemId, {
    prorate: true,
    quantity,
  });
};

const deleteSubscriptionItem = async (subscriptionItemId: string) => {
  return await stripe.subscriptionItems.del(subscriptionItemId);
};

type PreflightCheck = {
  community: ?DBCommunity,
  customer: ?RawCustomer,
  activeSubscription: ?RawSubscription,
  hasChargeableSource: boolean,
};
const jobPreflight = async (communityId: string): Promise<PreflightCheck> => {
  let defaultResult = {
    community: null,
    customer: null,
    activeSubscription: null,
    hasChargeableSource: false,
  };

  if (!communityId) {
    debug('No communityId in jobPreflight');
    return await defaultResult;
  }

  let dbCommunity = await getCommunityById(communityId);
  if (!dbCommunity) {
    debug('No community in db found during jobPreflight');
    return await defaultResult;
  }

  const { stripeCustomerId, administratorEmail, name, id } = dbCommunity;

  let customer;
  if (stripeCustomerId) {
    debug('Fetching customer from stripe in jobPreflight');
    try {
      customer = await getCustomer(stripeCustomerId);
    } catch (err) {
      return defaultResult;
    }
  } else {
    debug('Creating customer on stripe in jobPreflight');
    const createdCustomer = await createCustomer({
      administratorEmail,
      communityId: id,
      communityName: name,
    });
    customer = createdCustomer.customer;
    // if a customer was created in the preflight, always make sure to return
    // the updated community with the stripeCustomerId field set
    dbCommunity = await getCommunityById(communityId);
  }

  if (!customer) return defaultResult;

  debug('Preflight check completing...');

  return {
    customer,
    community: dbCommunity,
    activeSubscription: getActiveSubscription(customer),
    hasChargeableSource: hasChargeableSource(customer),
  };
};

export const StripeUtil = {
  getCustomer,
  hasChargeableSource,
  getChargeableSource,
  getSources,
  attachNewSource,
  detachSource,
  changeDefaultSource,
  hasActiveSubscription,
  getActiveSubscription,
  getSubscriptions,
  hasSubscriptionItemOfType,
  getSubscriptionItemOfType,
  cleanSubscriptions,
  cleanInvoices,
  createCustomer,
  deleteCustomer,
  updateCustomer,
  createFirstSubscription,
  addSubscriptionItem,
  updateSubscriptionItem,
  deleteSubscriptionItem,
  jobPreflight,
};
