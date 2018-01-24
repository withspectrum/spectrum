import gql from 'graphql-tag';
import { userInfoFragment } from '../user/userInfo';

export const communityMemberConnectionFragment = gql`
  fragment communityMembers on Community {
    memberConnection(filter: $filter) {
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      edges {
        node {
          ...userInfo
          isPro
          email
        }
      }
    }
  }
  ${userInfoFragment}
`;
