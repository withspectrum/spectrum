// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import communityInfoFragment from 'shared/graphql/fragments/community/communityInfo';
import type { CommunityInfoType } from '../../fragments/community/communityInfo';
import communityBillingSettingsFragment from '../../fragments/community/communityBillingSettings';
import type { CommunityBillingSettingsType } from '../../fragments/community/communityBillingSettings';

export type CancelSubscriptionType = {
  data: {
    MakeDefaultSource: {
      ...$Exact<CommunityInfoType>,
      ...$Exact<CommunityBillingSettingsType>,
    },
  },
};

type CancelSubscriptionInput = {
  communityId: string,
};

export const cancelSubscriptionMutation = gql`
  mutation cancelSubscription($input: CancelSubscriptionInput!) {
    cancelSubscription(input: $input) {
      ...communityInfo
      ...communityBillingSettings
    }
  }
  ${communityInfoFragment}
  ${communityBillingSettingsFragment}
`;

const cancelSubscriptionOptions = {
  props: ({ mutate }) => ({
    cancelSubscription: (input: CancelSubscriptionInput) =>
      mutate({
        variables: {
          input,
        },
      }),
  }),
};

export default graphql(cancelSubscriptionMutation, cancelSubscriptionOptions);
