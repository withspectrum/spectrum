// Flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import messageInfoFragment from '../../fragments/message/messageInfo';
import type { MessageInfoType } from '../../fragments/message/messageInfo';

export type ToggleReactionType = {
  ...$Exact<MessageInfoType>,
  __typename: string,
};

const toggleReactionMutation = gql`
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
    // renames the mutate method to 'toggleReaction' and accepts an argument
    // of the reaction object. This helps us keep the mutation logic out of
    // the component
    toggleReaction: reaction =>
      mutate({
        variables: {
          reaction,
        },
      }),
  }),
};

export default graphql(toggleReactionMutation, toggleReactionOptions);
