import { gql } from 'react-apollo';
import { userInfoFragment } from '../user/userInfo';

export const communityMembersFragment = gql`
  fragment communityMembers on Community {
    memberConnection {
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      edges {
        node {
          ...userInfo
          isPro
        }
      }
    }
  }
  ${userInfoFragment}
`;
