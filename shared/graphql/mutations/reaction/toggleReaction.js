// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import messageInfoFragment from '../../fragments/message/messageInfo';
import type { MessageInfoType } from '../../fragments/message/messageInfo';
import { getThreadMessageConnectionQuery } from '../../queries/thread/getThreadMessageConnection';

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
  props: ({ mutate, ownProps }) => ({
    toggleReaction: reaction => {
      const newCount = ownProps.message.reactions.hasReacted
        ? ownProps.message.reactions.count - 1
        : ownProps.message.reactions.count + 1;
      const newHasReacted = !ownProps.message.reactions.hasReacted;

      return mutate({
        variables: {
          reaction,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          toggleReaction: {
            ...ownProps.message,
            id: ownProps.message.id,
            reactions: {
              count: newCount,
              hasReacted: newHasReacted,
              __typename: 'ReactionData',
            },
            __typename: 'Message',
          },
        },
        update: (store, { data: { toggleReaction } }) => {
          const data = store.readQuery({
            query: getThreadMessageConnectionQuery,
            variables: {
              id: ownProps.threadId,
            },
          });

          // ignore the server response and only update the cache with the
          // optimistic response
          if (typeof toggleReaction.id === 'string') {
            return;
          }

          data.thread.messageConnection.edges.map(edge => {
            const { node } = edge;
            if (node.id !== ownProps.message.id) return edge;
            return {
              ...edge,
              node: {
                ...node,
                ...toggleReaction,
              },
            };
          });

          // Write our data back to the cache.
          store.writeQuery({
            query: getThreadMessageConnectionQuery,
            data,
            variables: {
              id: ownProps.threadId,
            },
          });
        },
      });
    },
  }),
};

export default graphql(toggleReactionMutation, toggleReactionOptions);
