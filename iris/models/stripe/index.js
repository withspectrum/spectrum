// @flow
require('now-env');
import UserError from '../../utils/UserError';
const STRIPE_TOKEN = process.env.STRIPE_TOKEN;
const stripe = require('stripe')(STRIPE_TOKEN);
const { v4: uuid } = require('uuid');
import type {
  State,
  CreateCustomerInput,
  UpdateCustomerInput,
  CreateSubscriptionInput,
  DeleteSubscriptionInput,
  Subscription,
  Customer,
  Source,
} from './types';

const userPlans = ['beta-pro'];
const communityPlans = [
  'moderator',
  'private-channel',
  'priority-support',
  'analytics',
  'indie-community',
  'business-community',
  'community-standard',
];

class StripeClass {
  /*
  ================= CLASS UTILS =================
  */
  state: State;

  state = {
    customerId: null,
    customer: null,
    subscriptions: null,
    sources: null,
  };

  constructor({ customerId }: { customerId?: ?string }) {
    // if the class is initialized with a customerId, save it in class State
    if (customerId) {
      this.state = Object.assign({}, this.state, { customerId });
    }
  }

  setState = (newState: Object) => Object.assign({}, this.state, newState);

  handleErrors = (err: Error) => new UserError(err.message);

  /*
  ================= GETS =================
  */

  getCustomer = async (): Promise<?Customer> => {
    const { customerId, customer } = this.state;

    if (!customerId) {
      throw new Error('Stripe class initialized without a customerId');
    }

    // skip the network request if we have already fetched the customer
    if (customer) return customer;

    try {
      const result = await stripe.customers.retrieve(customerId);

      if (result) {
        this.setState({
          customer: result,
          sources: result.sources.data,
          subscriptions: result.subscriptions.data,
        });

        return result;
      }

      return null;
    } catch (err) {
      return this.handleErrors(err);
    }
  };

  getCustomerSources = async (): Promise<Array<?Source>> => {
    const { customerId, sources } = this.state;

    if (!customerId) {
      throw new Error('Stripe class initialized without a customerId');
    }

    // skip the network request if we have already fetched the customer
    if (sources) return sources;

    try {
      const result = await this.getCustomer();

      if (result) {
        this.setState({ sources: result.sources.data });
        return result.sources.data;
      }

      return [];
    } catch (err) {
      return this.handleErrors(err);
    }
  };

  getCustomerSubscriptions = async (): Promise<Array<?Subscription>> => {
    const { customerId, subscriptions } = this.state;
    if (!customerId) {
      throw new Error('Stripe class initialized without a customerId');
    }
    // skip the network request if we have already fetched the customer
    if (subscriptions) return subscriptions;

    try {
      const result = await this.getCustomer();

      if (result) {
        this.setState({ subscriptions: result.subscriptions.data });
        return result.subscriptions.data;
      }

      return [];
    } catch (err) {
      return this.handleErrors(err);
    }
  };

  /*
  ================= SETS =================
  */

  createCustomer = async (input: CreateCustomerInput): Promise<?Customer> => {
    if (!input) {
      throw new Error('No input provided to createCustomer');
    }

    const { email, source } = input;

    if (!email) {
      throw new Error('No email or source provided to create a customer');
    }

    try {
      const result = await stripe.customers.create(
        {
          email,
          // source,
        },
        {
          idempotency_key: uuid(),
        }
      );

      if (result) {
        this.setState({ customer: result, sources: result.sources.data });
        return result;
      }

      return null;
    } catch (err) {
      return this.handleErrors(err);
    }
  };

  updateCustomer = async (input: UpdateCustomerInput): Promise<?Customer> => {
    const { customerId, email, source } = input;

    if (!customerId) {
      throw new Error('No customerId supplied to updateCustomer');
    }

    try {
      const result = await stripe.customers.update(
        customerId,
        {
          email,
          source,
        },
        {
          idempotency_key: uuid(),
        }
      );

      if (result) {
        this.setState({ customer: result, sources: result.sources.data });
      }
    } catch (err) {
      return this.handleErrors(err);
    }
  };

  createSubscription = async (
    input: CreateSubscriptionInput
  ): Promise<?Subscription> => {
    const { customerId, plan, quantity } = input;

    if (!customerId || !plan || !quantity) {
      throw new Error('Invalid arguments to createSubscription');
    }

    try {
      const subscription = await stripe.subscriptions.create(
        {
          customerId,
          items: [
            {
              plan,
              quantity: quantity ? quantity : 1, // if no quantity is provided, default to one
            },
          ],
        },
        {
          idempotency_key: uuid(),
        }
      );

      if (subscription) {
        return subscription;
      }

      return null;
    } catch (err) {
      return this.handleErrors(err);
    }
  };

  updateSubscription = async (): Promise<?Subscription> => {};

  deleteSubscription = async (
    input: DeleteSubscriptionInput
  ): Promise<?Subscription> => {
    const { subscriptionId } = input;

    if (!subscriptionId) {
      throw new Error('No subscriptionId to delete subscription');
    }

    try {
      const subscription = await stripe.subscriptions.del(
        subscriptionId,
        {
          atPeriodEnd: true,
        },
        {
          idempotency_key: uuid(),
        }
      );

      if (subscription) {
        return subscription;
      }

      return null;
    } catch (err) {
      return this.handleErrors(err);
    }
  };

  /*
  ================= Our API =================
  */

  // returns a subset of a customer's subscriptions only relating to being
  // a pro user on spectrum; ignores all community subscriptions
  getUserPlans = async (): Promise<Array<?Subscription>> => {
    const subscriptions = await this.getCustomerSubscriptions();

    if (subscriptions && subscriptions.length > 0) {
      return subscriptions.filter(
        sub => sub && userPlans.indexOf(sub.plan.name) > -1
      );
    }

    return [];
  };

  // returns a subset of a customer's subscriptions only related to a
  // community - ignores the user Pro plan
  getCommunityPlans = async (): Promise<Array<?Subscription>> => {
    const subscriptions = await this.getCustomerSubscriptions();
    if (subscriptions && subscriptions.length > 0) {
      return subscriptions.filter(
        sub => sub && communityPlans.indexOf(sub.plan.id) > -1
      );
    }

    return [];
  };

  availableModeratorSeats = async () => {
    const communityPlans = await this.getCommunityPlans();
    if (communityPlans && communityPlans.length > 0) {
      return communityPlans.reduce((total, current) => {
        if (!current) return total;

        if (current.plan.id === 'moderator' && current.status === 'active') {
          return total + current.quantity;
        }

        if (
          current.plan.id === 'indie-community' &&
          current.status === 'active'
        ) {
          return total + 1;
        }

        if (
          current.plan.id === 'business-community' &&
          current.status === 'active'
        ) {
          return total + 5;
        }
      }, 0);
    } else {
      return 0;
    }
  };

  availablePrivateChannels = async () => {
    const communityPlans = await this.getCommunityPlans();
    if (communityPlans && communityPlans.length > 0) {
      return communityPlans.reduce((total, current) => {
        if (!current) return total;

        if (
          current.plan.id === 'private-channel' &&
          current.status === 'active'
        ) {
          return total + current.quantity;
        }

        if (
          current.plan.id === 'indie-community' &&
          current.status === 'active'
        ) {
          return total + 1;
        }

        if (
          current.plan.id === 'business-community' &&
          current.status === 'active'
        ) {
          return total + 5;
        }
      }, 0);
    } else {
      return 0;
    }
  };

  hasAnalytics = async () => {
    const subs = await this.getCommunityPlans();
    if (subs && subs.length > 0) {
      const reduction = subs.reduce((total, current) => {
        if (!current) return total;

        if (current.plan.id === 'analytics' && current.status === 'active') {
          return total + 1;
        }

        if (
          current.plan.id === 'business-community' &&
          current.status === 'active'
        ) {
          return total + 1;
        }

        if (
          current.plan.id === 'community-standard' &&
          current.status === 'active'
        ) {
          return total + 1;
        }
      }, 0);

      if (reduction && reduction > 0) return true;
      return false;
    } else {
      return false;
    }
  };

  hasPrioritySupport = async () => {
    const communityPlans = await this.getCommunityPlans();
    if (communityPlans && communityPlans.length > 0) {
      const reduction = userPlans.reduce((total, current) => {
        if (
          current.plan === 'priority-support' &&
          current.status === 'active'
        ) {
          return total + 1;
        }

        if (
          current.plan === 'business-community' &&
          current.status === 'active'
        ) {
          return total + 1;
        }

        if (current.plan === 'indie-community' && current.status === 'active') {
          return total + 1;
        }
      }, 0);

      if (reduction && reduction > 0) return true;
      return false;
    } else {
      return false;
    }
  };
}

type StripeCustomerInput = { customerId?: ?string };
export const StripeCustomer = {
  init: (args: ?StripeCustomerInput) => new StripeClass(args || {}),
};
