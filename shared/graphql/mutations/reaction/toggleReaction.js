// Flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import messageInfoFragment from '../../fragments/message/messageInfo';
import type { MessageInfoType } from '../../fragments/message/messageInfo';

export type ToggleReactionType = {
  ...$Exact<MessageInfoType>,
  __typename: string,
};

export const toggleReactionMutation = gql`
  mutation toggleReaction($reaction: ReactionInput!) {
    toggleReaction(reaction: $reaction) {
      ...messageInfo
      __typename
    }
  }
  ${messageInfoFragment}
`;

const toggleReactionOptions = {
  props: ({ mutate }) => ({
    toggleReaction: reaction =>
      mutate({
        variables: {
          reaction,
        },
      }),
  }),
};

export default graphql(toggleReactionMutation, toggleReactionOptions);
