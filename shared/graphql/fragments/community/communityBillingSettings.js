// @flow
import gql from 'graphql-tag';

type SubscriptionType = {
  id: string,
  created: Date,
  status: string,
  billing_cycle_anchor: Date,
  canceled_at: ?Date,
  discount: ?{
    amount_off: ?number,
    percent_off: ?number,
    id: string,
  },
  items: ?{
    created: Date,
    planId: string,
    planName: string,
    amount: number,
    quantity: number,
  },
};

export type CommunityBillingSettingsType = {
  billingSettings: {
    administratorEmail: ?string,
    pendingAdministratorEmail?: ?string,
    sources: Array<any>,
    invoices: Array<any>,
    subscriptions: Array<SubscriptionType>,
  },
};

export default gql`
  fragment communityBillingSettings on Community {
    billingSettings {
      administratorEmail
      pendingAdministratorEmail
      sources {
        id
        isDefault
        card {
          brand
          last4
          exp_month
          exp_year
        }
      }
      invoices {
        id
      }
      subscriptions {
        id
        created
        status
        billing_cycle_anchor
        current_period_end
        canceled_at
        discount {
          amount_off
          percent_off
          id
        }
        items {
          id
          created
          planId
          planName
          amount
          quantity
        }
      }
    }
  }
`;
