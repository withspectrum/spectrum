// @flow
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import communityInfoFragment from 'shared/graphql/fragments/community/communityInfo';
import userInfoFragment from 'shared/graphql/fragments/user/userInfo';

const getCommunityTopMembersQuery = gql`
  query getCommunityTopMembers($id: ID) {
    community(id: $id) {
      ...communityInfo
      topMembers {
        ...userInfo
        isPro
        contextPermissions {
          reputation
          isOwner
          isModerator
        }
      }
    }
  }
  ${communityInfoFragment}
  ${userInfoFragment}
`;

const getCommunityTopMembersOptions = {
  options: ({ id }: { id: string }) => ({
    variables: {
      id,
    },
    fetchPolicy: 'cache-and-network',
  }),
};

export default graphql(
  getCommunityTopMembersQuery,
  getCommunityTopMembersOptions
);
