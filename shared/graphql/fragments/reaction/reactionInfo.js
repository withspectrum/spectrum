// @flow
import gql from 'graphql-tag';

export type ReactionInfoType = {
  count: number,
  hasReacted: boolean,
};

export default gql`
  fragment reactionInfo on Reaction {
    count
    hasReacted
  }
`;
