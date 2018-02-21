// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import communityInfoFragment from 'shared/graphql/fragments/community/communityInfo';
import type { CommunityInfoType } from '../../fragments/community/communityInfo';
import communitySettingsFragment from 'shared/graphql/fragments/community/communitySettings';
import type { CommunitySettingsType } from '../../fragments/community/communitySettings';
import { getCommunitySettingsByMatchQuery } from '../../queries/community/getCommunitySettings';

export type EnableCommunityAnalyticsType = {
  data: {
    EnableCommunityAnalytics: {
      ...$Exact<CommunityInfoType>,
      ...$Exact<CommunitySettingsType>,
    },
  },
};

type EnableCommunityAnalyticsInput = {
  communityId: string,
};

export const enableCommunityAnalyticsMutation = gql`
  mutation enableCommunityAnalytics($input: EnableCommunityAnalyticsInput!) {
    enableCommunityAnalytics(input: $input) {
      ...communityInfo
      ...communitySettings
    }
  }
  ${communityInfoFragment}
  ${communitySettingsFragment}
`;

const enableCommunityAnalyticsOptions = {
  props: ({ mutate, ownProps }) => ({
    enableCommunityAnalytics: (input: EnableCommunityAnalyticsInput) =>
      mutate({
        variables: {
          input,
        },
        update: store => {
          const data = store.readQuery({
            query: getCommunitySettingsByMatchQuery,
            variables: {
              slug: ownProps.community.slug,
            },
          });

          console.log('analytics data', data);

          data.community.hasFeatures = {
            ...data.community.hasFeatures,
            analytics: true,
            __typename: 'Features',
          };

          store.writeQuery({
            query: getCommunitySettingsByMatchQuery,
            data,
            variables: {
              slug: ownProps.community.slug,
            },
          });
        },
      }),
  }),
};

export default graphql(
  enableCommunityAnalyticsMutation,
  enableCommunityAnalyticsOptions
);
