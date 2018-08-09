// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import communityInfoFragment from '../../fragments/community/communityInfo';
import type { CommunityInfoType } from '../../fragments/community/communityInfo';
import communitySettingsFragment from '../../fragments/community/communitySettings';
import type { CommunitySettingsType } from '../../fragments/community/communitySettings';
import communityMetaDataFragment from '../../fragments/community/communityMetaData';
import type { CommunityMetaDataType } from '../../fragments/community/communityMetaData';

export type DisableCommunityTokenJoinType = {
  data: {
    community: {
      ...$Exact<CommunityInfoType>,
      ...$Exact<CommunityMetaDataType>,
      ...$Exact<CommunitySettingsType>,
    },
  },
};

export const disableCommunityTokenJoinMutation = gql`
  mutation disableCommunityTokenJoin($input: DisableCommunityTokenJoinInput!) {
    disableCommunityTokenJoin(input: $input) {
      ...communityInfo
      ...communityMetaData
      ...communitySettings
    }
  }
  ${communityInfoFragment}
  ${communitySettingsFragment}
  ${communityMetaDataFragment}
`;

const disableCommunityTokenJoinOptions = {
  props: ({ mutate }) => ({
    disableCommunityTokenJoin: input =>
      mutate({
        variables: {
          input,
        },
      }),
  }),
};

export default graphql(
  disableCommunityTokenJoinMutation,
  disableCommunityTokenJoinOptions
);
