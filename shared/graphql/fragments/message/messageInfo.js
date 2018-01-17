// @flow
import gql from 'graphql-tag';
import userInfoFragment from '../user/userInfo';

export default gql`
  fragment messageInfo on Message {
    id
    timestamp
    messageType
    sender {
      ...userInfo
      isPro
      contextPermissions {
        communityId
        reputation
        isOwner
        isModerator
      }
    }
    reactions {
      count
      hasReacted
    }
    content {
      body
    }
  }
  ${userInfoFragment}
`;
