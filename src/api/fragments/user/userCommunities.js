import { gql } from 'react-apollo';
import { communityInfoFragment } from '../community/communityInfo';

export const userCommunitiesFragment = gql`
  fragment userCommunities on User {
    communityConnection {
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      edges {
        node {
          ...communityInfo
          contextPermissions {
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
