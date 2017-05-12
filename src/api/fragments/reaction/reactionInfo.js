// @flow
// $FlowFixMe
import { gql } from 'react-apollo';

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
