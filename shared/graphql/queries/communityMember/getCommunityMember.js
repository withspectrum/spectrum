// @flow
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { type CommunityMemberInfoType } from '../../fragments/communityMember/communityMemberInfo';

export type GetCommunityMemberType = {
  ...$Exact<CommunityMemberInfoType>,
};

export const getCommunityMemberQuery = gql`
  query getCommunityMember($userId: ID!, $communityId: ID!) {
    communityMember(userId: $userId, communityId: $communityId) {
      id
      isPending
    }
  }
`;

const getCommunityMemberOptions = {
  options: ({ userId, communityId }) => ({
    variables: {
      userId,
      communityId,
    },
  }),
};

export default graphql(getCommunityMemberQuery, getCommunityMemberOptions);
