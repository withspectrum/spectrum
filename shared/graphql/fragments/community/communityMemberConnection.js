// @flow
import gql from 'graphql-tag';
import userInfoFragment from '../user/userInfo';

export default gql`
  fragment communityMemberConnection on Community {
    memberConnection(after: $after) {
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      edges {
        cursor
        node {
          ...userInfo
          isPro
          totalReputation
          contextPermissions {
            communityId
            reputation
            isOwner
            isModerator
          }
        }
      }
    }
  }
  ${userInfoFragment}
`;
