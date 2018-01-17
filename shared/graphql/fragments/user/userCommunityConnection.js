// @flow
import gql from 'graphql-tag';
import communityInfoFragment from '../community/communityInfo';

export default gql`
  fragment userCommunityConnection on User {
    communityConnection {
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      edges {
        node {
          ...communityInfo
          contextPermissions {
            communityId
            isOwner
            isModerator
            reputation
          }
        }
      }
    }
  }
  ${communityInfoFragment}
`;
