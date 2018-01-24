import gql from 'graphql-tag';
import { userInfoFragment } from '../user/userInfo';

export const communityMemberConnectionFragment = gql`
  fragment communityMembers on Community {
    memberConnection(role: $role) {
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
