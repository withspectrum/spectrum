// @flow
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import communityInfoFragment from '../../fragments/community/communityInfo';
import type { CommunityInfoType } from '../../fragments/community/communityInfo';

export type GetCommunityBillingSettingsType = {
  ...$Exact<CommunityInfoType>,
  billingSettings: {
    administratorEmail: ?string,
    stripeCustomerId: ?string,
    pendingAdministratorEmail: ?string,
  },
};

export const getCommunityBillingSettingsQuery = gql`
  query getCommunityBillingSettings($id: ID) {
    community(id: $id) {
      ...communityInfo
      billingSettings {
        administratorEmail
        stripeCustomerId
        pendingAdministratorEmail
      }
    }
  }
  ${communityInfoFragment}
`;

const getCommunityBillingSettingsOptions = {
  options: ({ id }) => ({
    variables: {
      id,
    },
  }),
};

export default graphql(
  getCommunityBillingSettingsQuery,
  getCommunityBillingSettingsOptions
);
