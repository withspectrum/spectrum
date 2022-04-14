// @flow
import gql from 'graphql-tag';

export const reactionInfoFragment = gql`
  fragment reactionInfo on Reaction {
    count
    hasReacted
  }
`;
