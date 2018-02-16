// @flow
import gql from 'graphql-tag';

export type CommunityBillingSettingsType = {
  billingSettings: {
    administratorEmail: ?string,
    pendingAdministratorEmail?: ?string,
    sources: Array<any>,
    invoices: Array<any>,
    subscriptions: Array<any>,
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
      }
    }
  }
`;
