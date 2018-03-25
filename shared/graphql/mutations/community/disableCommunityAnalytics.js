// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import communityInfoFragment from 'shared/graphql/fragments/community/communityInfo';
import type { CommunityInfoType } from '../../fragments/community/communityInfo';
import communitySettingsFragment from 'shared/graphql/fragments/community/communitySettings';
import type { CommunitySettingsType } from '../../fragments/community/communitySettings';
import { getCommunitySettingsByMatchQuery } from '../../queries/community/getCommunitySettings';
import { COMMUNITY_ANALYTICS } from 'pluto/queues/constants';

export type DisableCommunityAnalyticsType = {
  data: {
    disableCommunityAnalytics: {
      ...$Exact<CommunityInfoType>,
      ...$Exact<CommunitySettingsType>,
    },
  },
};

type DisableCommunityAnalyticsInput = {
  communityId: string,
};

export const disableCommunityAnalyticsMutation = gql`
  mutation disableCommunityAnalytics($input: DisableCommunityAnalyticsInput!) {
    disableCommunityAnalytics(input: $input) {
      ...communityInfo
      ...communitySettings
    }
  }
  ${communityInfoFragment}
  ${communitySettingsFragment}
`;

const disableCommunityAnalyticsOptions = {
  props: ({ mutate, ownProps }) => ({
    disableCommunityAnalytics: (input: DisableCommunityAnalyticsInput) =>
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

          data.community.billingSettings = Object.assign(
            {},
            data.community.billingSettings,
            {
              subscriptions: data.community.billingSettings.subscriptions.map(
                sub =>
                  Object.assign({}, sub, {
                    items: sub.items.filter(
                      item => item.planId !== COMMUNITY_ANALYTICS
                    ),
                  })
              ),
            }
          );

          data.community.hasFeatures = Object.assign(
            {},
            data.community.hasFeatures,
            {
              analytics: false,
              __typename: 'Features',
            }
          );

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

export default graphql(
  disableCommunityAnalyticsMutation,
  disableCommunityAnalyticsOptions
);
