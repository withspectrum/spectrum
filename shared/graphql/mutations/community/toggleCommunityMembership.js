// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import communityMetaDataFragment from '../../fragments/community/communityMetaData';
import type { CommunityMetaDataType } from '../../fragments/community/communityMetaData';
import communityInfoFragment from '../../fragments/community/communityInfo';
import type { CommunityInfoType } from '../../fragments/community/communityInfo';
import communityChannelConnectionFragment from '../../fragments/community/communityChannelConnection';
import type { CommunityChannelConnectionType } from '../../fragments/community/communityChannelConnection';

export type ToggleCommunityMembershipType = {
  data: {
    toggleCommunityMembership: {
      ...$Exact<CommunityInfoType>,
      ...$Exact<CommunityMetaDataType>,
      ...$Exact<CommunityChannelConnectionType>,
    },
  },
};

export const toggleCommunityMembershipQuery = gql`
  mutation toggleCommunityMembership($communityId: ID!) {
    toggleCommunityMembership(communityId: $communityId) {
      ...communityInfo
      ...communityMetaData
      ...communityChannelConnection
    }
  }
  ${communityInfoFragment}
  ${communityMetaDataFragment}
  ${communityChannelConnectionFragment}
`;

const toggleCommunityMemershipOptions = {
  props: ({ mutate }) => ({
    toggleCommunityMembership: ({ communityId }: { communityId: string }) =>
      mutate({
        variables: {
          communityId,
        },
      }),
  }),
};

export default graphql(
  toggleCommunityMembershipQuery,
  toggleCommunityMemershipOptions
);
