// @flow
import gql from 'graphql-tag';
import userInfoFragment from '../user/userInfo';

export default gql`
  fragment channelMemberConnection on Channel {
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
