// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import communityInfoFragment from 'shared/graphql/fragments/community/communityInfo';
import type { CommunityInfoType } from '../../fragments/community/communityInfo';
import communitySettingsFragment from 'shared/graphql/fragments/community/communitySettings';
import type { CommunitySettingsType } from '../../fragments/community/communitySettings';

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
  props: ({ mutate }) => ({
    enableCommunityAnalytics: (input: EnableCommunityAnalyticsInput) =>
      mutate({
        variables: {
          input,
        },
      }),
  }),
};

export default graphql(
  enableCommunityAnalyticsMutation,
  enableCommunityAnalyticsOptions
);
