// @flow
// $FlowFixMe
import { gql } from 'react-apollo';
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
