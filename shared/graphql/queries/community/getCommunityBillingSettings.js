// @flow
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import communityInfoFragment from '../../fragments/community/communityInfo';
import type { CommunityInfoType } from '../../fragments/community/communityInfo';
import communityBillingSettingsFragment from '../../fragments/community/communityBillingSettings';
import type { CommunityBillingSettingsType } from '../../fragments/community/communityBillingSettings';

export type GetCommunityBillingSettingsType = {
  ...$Exact<CommunityInfoType>,
  ...$Exact<CommunityBillingSettingsType>,
};

export const getCommunityBillingSettingsQuery = gql`
  query getCommunityBillingSettings($id: ID) {
    community(id: $id) {
      ...communityInfo
      ...communityBillingSettings
    }
  }
  ${communityInfoFragment}
  ${communityBillingSettingsFragment}
`;

const getCommunityBillingSettingsOptions = {
  options: ({ id }) => ({
    variables: {
      id,
    },
    fetchPolicy: 'network-only',
  }),
};

export default graphql(
  getCommunityBillingSettingsQuery,
  getCommunityBillingSettingsOptions
);
