import gql from 'graphql-tag';
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
