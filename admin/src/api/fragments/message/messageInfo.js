// @flow
import gql from 'graphql-tag';
import { userInfoFragment } from '../user/userInfo';

export const messageInfoFragment = gql`
  fragment messageInfo on Message {
    id
    timestamp
    messageType
    sender {
      ...userInfo
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
