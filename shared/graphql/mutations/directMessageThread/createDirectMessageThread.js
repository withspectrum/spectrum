// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import directMessageThreadInfoFragment from '../../fragments/directMessageThread/directMessageThreadInfo';
import type { DirectMessageThreadInfoType } from '../../fragments/directMessageThread/directMessageThreadInfo';
import userDirectMessageThreadsFragment from '../../fragments/user/userDirectMessageThreadConnection';
import userInfoFragment from '../../fragments/user/userInfo';
import { subscribeToUpdatedDirectMessageThreads } from '../../subscriptions';
import { getCurrentUserDMThreadConnectionQuery } from '../../queries/directMessageThread/getCurrentUserDMThreadConnection';

export type CreateDirectMessageThreadType = {
  ...$Exact<DirectMessageThreadInfoType>,
};

export const createDirectMessageThreadMutation = gql`
  mutation createDirectMessageThread($input: DirectMessageThreadInput!) {
    createDirectMessageThread(input: $input) {
      ...directMessageThreadInfo
    }
  }
  ${directMessageThreadInfoFragment}
`;
const createDirectMessageThreadOptions = {
  options: {
    refetchQueries: ['currentUserDirectMessageThreads'],
  },
  props: ({ input, mutate }) => ({
    createDirectMessageThread: input =>
      mutate({
        variables: {
          input,
        },
        update: (store, { data: { createDirectMessageThread } }) => {
          if (!createDirectMessageThread) return;
          const data = store.readQuery({
            query: getCurrentUserDMThreadConnectionQuery,
          });

          data.user.directMessageThreadsConnection.edges.push({
            cursor: createDirectMessageThread.id,
            node: createDirectMessageThread,
            __typename: 'DirectMessageThreadEdge',
          });

          // Write our data back to the cache.
          store.writeQuery({
            query: getCurrentUserDMThreadConnectionQuery,
            data,
          });
        },
      }),
  }),
};

export default graphql(
  createDirectMessageThreadMutation,
  createDirectMessageThreadOptions
);
