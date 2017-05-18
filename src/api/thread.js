// @flow
// $FlowFixMe
import { graphql, gql } from 'react-apollo';

/*
  Delete a thread
*/
const DELETE_THREAD_MUTATION = gql`
  mutation deleteThread($id: ID!) {
    deleteThread(id: $id)
  }
`;
const DELETE_THREAD_OPTIONS = {
  props: ({ id, mutate }) => ({
    deleteThread: id =>
      mutate({
        variables: {
          id,
        },
      }),
  }),
};
export const deleteThreadMutation = graphql(
  DELETE_THREAD_MUTATION,
  DELETE_THREAD_OPTIONS
);
