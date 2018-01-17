// @flow
import gql from 'graphql-tag';
import userInfoFragment from '../user/userInfo';

export default gql`
  fragment communityMemberConnection on Community {
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
