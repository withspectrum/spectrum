// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import threadInfoFragment from '../../fragments/thread/threadInfo';
import type { ThreadInfoType } from '../../fragments/thread/threadInfo';
import { getThreadByIdQuery } from '../../queries/thread/getThread';

export type AddThreadReactionType = {
  data: {
    addThreadReaction: {
      ...$Exact<ThreadInfoType>,
    },
  },
};

export type AddThreadReactionProps = {
  addThreadReaction: ({ input: { threadId: string } }) => Promise<
    AddThreadReactionType
  >,
};

export const addThreadReactionQuery = gql`
  mutation addThreadReaction($input: AddThreadReactionInput!) {
    addThreadReaction(input: $input) {
      ...threadInfo
    }
  }
  ${threadInfoFragment}
`;

const addThreadReactionOptions = {
  props: ({ ownProps, mutate }) => ({
    addThreadReaction: ({ input }) => {
      const fakeId = Math.round(Math.random() * -1000000);

      return mutate({
        variables: {
          input: {
            ...input,
            type: 'like',
          },
        },
        optimisticResponse: {
          __typename: 'Mutation',
          addThreadReaction: {
            id: fakeId,
            threadId: ownProps.thread.id,
            type: 'like',
            __typename: 'ThreadReaction',
          },
        },
        update: (store, { data: { addThreadReaction } }) => {
          const data = store.readQuery({
            query: getThreadByIdQuery,
            variables: {
              id: ownProps.thread.id,
            },
          });

          // ignore the server response and only update the cache with the
          // optimistic response
          if (typeof addThreadReaction.id === 'string') return;

          data.thread.reactions.count++;
          data.thread.reactions.hasReacted = true;

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

export default graphql(addThreadReactionQuery, addThreadReactionOptions);
