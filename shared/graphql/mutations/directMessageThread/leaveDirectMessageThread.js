// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { getCurrentUserDMThreadConnectionQuery } from 'shared/graphql/queries/directMessageThread/getCurrentUserDMThreadConnection';

export const leaveDirectMessageThread = gql`
  mutation leaveDirectMessageThread($input: LeaveDirectMessageThreadInput!) {
    leaveDirectMessageThread(input: $input) {
      id
    }
  }
`;

const leaveDMThreadOptions = {
  props: ({ mutate }) => ({
    leaveDirectMessageThread: threadId =>
      mutate({
        variables: {
          input: {
            threadId,
          },
        },
        refetchQueries: ['currentUserDirectMessageThreads'],
      }),
  }),
};

export default graphql(leaveDirectMessageThread, leaveDMThreadOptions);
