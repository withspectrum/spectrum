// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import threadInfoFragment from '../../fragments/thread/threadInfo';
import type { ThreadInfoType } from '../../fragments/thread/threadInfo';
import { getThreadByIdQuery } from '../../queries/thread/getThread';

export type RemoveThreadReactionType = {
  data: {
    removeThreadReaction: {
      ...$Exact<ThreadInfoType>,
    },
  },
};

export type RemoveThreadReactionProps = {
  removeThreadReaction: ({ input: { threadId: string } }) => Promise<
    RemoveThreadReactionType
  >,
};

export const removeThreadReactionQuery = gql`
  mutation removeThreadReaction($input: RemoveThreadReactionInput!) {
    removeThreadReaction(input: $input) {
      ...threadInfo
    }
  }
  ${threadInfoFragment}
`;

const removeThreadReactionOptions = {
  props: ({ ownProps, mutate }) => ({
    removeThreadReaction: ({ input }) => {
      const fakeId = Math.round(Math.random() * -1000000);

      return mutate({
        variables: {
          input,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          removeThreadReaction: {
            id: fakeId,
            threadId: ownProps.thread.id,
            type: 'like',
            __typename: 'ThreadReaction',
          },
        },
        update: (store, { data: { removeThreadReaction } }) => {
          const data = store.readQuery({
            query: getThreadByIdQuery,
            variables: {
              id: ownProps.thread.id,
            },
          });

          // ignore the server response and only update the cache with the
          // optimistic response
          if (typeof removeThreadReaction.id === 'string') return;

          data.thread.reactions.count--;
          data.thread.reactions.hasReacted = false;

          // Write our data back to the cache.
          store.writeQuery({
            query: getThreadByIdQuery,
            data,
            variables: {
              id: ownProps.thread.id,
            },
          });
        },
      });
    },
  }),
};

export default graphql(removeThreadReactionQuery, removeThreadReactionOptions);
