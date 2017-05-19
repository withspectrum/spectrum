// @flow
// $FlowFixMe
import { graphql, gql } from 'react-apollo';

/*
  Delete a thread
*/
const DELETE_THREAD_MUTATION = gql`
  mutation deleteThread($threadId: ID!) {
    deleteThread(threadId: $threadId)
  }
`;
const DELETE_THREAD_OPTIONS = {
  props: ({ threadId, mutate }) => ({
    deleteThread: threadId =>
      mutate({
        variables: {
          threadId,
        },
      }),
  }),
};
export const deleteThreadMutation = graphql(
  DELETE_THREAD_MUTATION,
  DELETE_THREAD_OPTIONS
);
