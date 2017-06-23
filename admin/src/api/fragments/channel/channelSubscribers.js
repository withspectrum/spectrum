import { gql } from 'react-apollo';
import { userInfoFragment } from '../user/userInfo';

export const channelMembersFragment = gql`
  fragment channelMembers on Channel {
    memberConnection {
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      edges {
        node {
          ...userInfo
        }
      }
    }
  }
  ${userInfoFragment}
`;
