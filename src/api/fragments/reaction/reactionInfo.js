// @flow
// $FlowFixMe
import { gql } from 'react-apollo';
import { userInfoFragment } from '../user/userInfo';

export const reactionInfoFragment = gql`
  fragment reactionInfo on Reaction {
    id
    type
    user {
      # used to determine how the reaction is styled in the ui
      uid
    }
  }
`;
