import gql from 'graphql-tag';
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
        }
      }
    }
  }
  ${communityInfoFragment}
`;
