// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import communityMetaDataFragment from '../../fragments/community/communityMetaData';
import communityInfoFragment from '../../fragments/community/communityInfo';
import communityChannelConnectionFragment from '../../fragments/community/communityChannelConnection';

const toggleCommunityMembershipQuery = gql`
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
  props: ({ communityId, mutate }) => ({
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
