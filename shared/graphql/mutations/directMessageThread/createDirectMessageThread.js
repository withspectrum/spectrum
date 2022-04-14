// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import directMessageThreadInfoFragment from '../../fragments/directMessageThread/directMessageThreadInfo';
import type { DirectMessageThreadInfoType } from '../../fragments/directMessageThread/directMessageThreadInfo';
import { getCurrentUserDMThreadConnectionQuery } from '../../queries/directMessageThread/getCurrentUserDMThreadConnection';
import type { CreateDirectMessageThreadInput } from '../../../../api/mutations/directMessageThread/createDirectMessageThread';

export type CreateDirectMessageThreadType = {
  data: {
    createDirectMessageThread: {
      ...$Exact<DirectMessageThreadInfoType>,
    },
  },
};

export type CreateDirectMessageThreadProps = {
  createDirectMessageThread: (
    input: CreateDirectMessageThreadType
  ) => Promise<CreateDirectMessageThreadType>,
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
  props: ({ mutate }) => ({
    createDirectMessageThread: input =>
      mutate({
        variables: {
          input,
        },
        update: (store, { data: { createDirectMessageThread } }) => {
          if (!createDirectMessageThread) return;
          const data = store.readQuery({
            query: getCurrentUserDMThreadConnectionQuery,
            variables: { after: '' },
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
