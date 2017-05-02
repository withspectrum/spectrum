import { gql } from 'react-apollo';
import { userInfoFragment } from '../user/userInfo';

export const messageInfoFragment = gql`
  fragment messageInfo on Message {
    id
    timestamp
    sender {
      ...userInfo
    }
    reactions {
      id
      type
    }
    message {
      type
      content
    }
  }
  ${userInfoFragment}
`;
