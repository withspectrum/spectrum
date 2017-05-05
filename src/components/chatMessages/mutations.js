// @flow
// $FlowFixMe
import { graphql, gql } from 'react-apollo';
import {
  reactionInfoFragment,
} from '../../api/fragments/reaction/reactionInfo';

export const toggleReaction = graphql(
  gql`
    mutation toggleReaction($reaction: ReactionInput!) {
      toggleReaction(reaction: $reaction) {
        ...reactionInfo
      }
    }
    ${reactionInfoFragment}
  `
);
