// @flow
import gql from 'graphql-tag';
import userInfoFragment from '../user/userInfo';

export default gql`
  fragment channelMemberConnection on Channel {
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
          contextPermissions {
            communityId
            reputation
          }
        }
      }
    }
  }
  ${userInfoFragment}
`;
