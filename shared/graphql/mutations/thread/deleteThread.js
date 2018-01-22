// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

export type DeleteThreadType = boolean;

const deleteThreadMutation = gql`
  mutation deleteThread($threadId: ID!) {
    deleteThread(threadId: $threadId)
  }
`;

const deleteThreadOptions = {
  props: ({ threadId, mutate }) => ({
    deleteThread: (threadId: string) =>
      mutate({
        variables: {
          threadId,
        },
      }),
  }),
};

export default graphql(deleteThreadMutation, deleteThreadOptions);
