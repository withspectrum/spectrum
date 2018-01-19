// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import threadInfoFragment from '../../fragments/thread/threadInfo';

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
