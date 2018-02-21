// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import communityInfoFragment from 'shared/graphql/fragments/community/communityInfo';
import type { CommunityInfoType } from '../../fragments/community/communityInfo';
import communitySettingsFragment from '../../fragments/community/communitySettings';
import type { CommunitySettingsType } from '../../fragments/community/communitySettings';
import { getCommunitySettingsByMatchQuery } from '../../queries/community/getCommunitySettings';

export type CancelSubscriptionType = {
  data: {
    MakeDefaultSource: {
      ...$Exact<CommunityInfoType>,
      ...$Exact<CommunitySettingsType>,
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
      ...communitySettings
    }
  }
  ${communityInfoFragment}
  ${communitySettingsFragment}
`;

const cancelSubscriptionOptions = {
  props: ({ ownProps, mutate }) => ({
    cancelSubscription: (input: CancelSubscriptionInput) =>
      mutate({
        variables: {
          input,
        },
        update: store => {
          console.log(ownProps);
          const data = store.readQuery({
            query: getCommunitySettingsByMatchQuery,
            variables: {
              slug: ownProps.slug,
            },
          });

          data.community.billingSettings = {
            ...data.community.billingSettings,
            subscriptions: [],
            __typename: 'BillingSettings',
          };

          store.writeQuery({
            query: getCommunitySettingsByMatchQuery,
            data,
            variables: {
              slug: ownProps.slug,
            },
          });
        },
      }),
  }),
};

export default graphql(cancelSubscriptionMutation, cancelSubscriptionOptions);
