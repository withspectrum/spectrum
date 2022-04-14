// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

export type DeleteThreadType = {
  data: {
    deleteThread: boolean,
  },
};

export const deleteThreadMutation = gql`
  mutation deleteThread($threadId: ID!) {
    deleteThread(threadId: $threadId)
  }
`;

const deleteThreadOptions = {
  props: ({ mutate }) => ({
    deleteThread: (threadId: string) =>
      mutate({
        variables: {
          threadId,
        },
      }),
  }),
};

export default graphql(deleteThreadMutation, deleteThreadOptions);
