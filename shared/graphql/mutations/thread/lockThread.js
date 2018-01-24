// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

export type LockThreadType = {
  id: string,
  isLocked: boolean,
};

export const lockThreadMutation = gql`
  mutation setThreadLock($threadId: ID!, $value: Boolean!) {
    setThreadLock(threadId: $threadId, value: $value) {
      id
      isLocked
    }
  }
`;

const lockThreadOptions = {
  props: ({ mutate }) => ({
    setThreadLock: ({
      threadId,
      value,
    }: {
      threadId: string,
      value: boolean,
    }) =>
      mutate({
        variables: {
          threadId,
          value,
        },
      }),
  }),
};

export default graphql(lockThreadMutation, lockThreadOptions);
