// @flow
// $FlowFixMe
import { gql } from 'react-apollo';

export const reactionInfoFragment = gql`
  fragment reactionInfo on Reaction {
    count
    hasReacted
  }
`;
