import { gql } from 'react-apollo';
import { userInfoFragment } from '../user/userInfo';

export const messageInfoFragment = gql`
  fragment messageInfo on Message {
    id
    timestamp
    message {
      content
      type
    }
    sender {
      ...userInfo
    }
  }
  ${userInfoFragment}
`;
