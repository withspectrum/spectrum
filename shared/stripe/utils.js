// @flow
const debug = require('debug')('pluto:queues:stripe-util');
import { stripe } from 'shared/stripe';
import type { RawCustomer } from 'shared/stripe/types/customer';
import type { RawSubscription } from 'shared/stripe/types/subscription';
import type { DBCommunity } from 'shared/types';
import type { SubscriptionItem } from 'shared/stripe/types/subscriptionItem';
import type { RawSource } from 'shared/stripe/types/source';
import { getCommunityById, setStripeCustomerId } from 'iris/models/community';

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

const getSources = (customer: RawCustomer): Array<?RawSource> => {
  if (!customer) return [];
  if (!customer.sources || customer.sources.data.length === 0) return [];

  return customer.sources.data.map(source => {
    if (!source) return;
    return Object.assign({}, source, {
      isDefault: source.id === customer.default_source,
    });
  });
};

type AttachNewSourceInput = {
  customerId: string,
  sourceId: string,
};
const attachNewSource = async (
  input: AttachNewSourceInput
): Promise<RawSource> => {
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
const changeDefaultSource = async (
  input: ChangeDefaultSourceInput
): Promise<RawCustomer> => {
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

const getSubscriptionItemOfType = (
  customer: RawCustomer,
  type: string
): ?SubscriptionItem => {
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
const createCustomer = async (
  customerInput: CreateCustomerInput
): Promise<CreateCustomerOutput> => {
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
  subscriptionItemType: string,
};
const createFirstSubscription = async (input: FirstSubInput) => {
  const { customerId, subscriptionItemType } = input;
  const billingAnchor = Math.floor(new Date().getTime() / 1000);
  return await stripe.subscriptions.create({
    customer: customerId,
    billing_cycle_anchor: billingAnchor,
    items: [
      // NOTE: We have to include this dummy item in order to prevent
      // the top-level subscription from thinking it's about any
      // specific feature
      {
        plan: 'community-features',
        quantity: 1,
      },
      {
        plan: subscriptionItemType,
        quantity: 1,
      },
    ],
  });
};

type AddSIInput = {
  subscriptionId: string,
  subscriptionItemType: string,
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
    customer = await getCustomer(stripeCustomerId);
  } else {
    debug('Creating customer on stripe in jobPreflight');
    const createdCustomer = await createCustomer({
      administratorEmail,
      communityId: id,
      communityName: name,
    });
    customer = createdCustomer.customer;
  }

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
  createCustomer,
  deleteCustomer,
  updateCustomer,
  createFirstSubscription,
  addSubscriptionItem,
  updateSubscriptionItem,
  deleteSubscriptionItem,
  jobPreflight,
};
