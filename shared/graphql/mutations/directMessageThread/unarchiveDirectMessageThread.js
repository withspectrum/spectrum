// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

export const unarchiveDirectMessageThread = gql`
  mutation unarchiveDirectMessageThread($input: UnarchiveDMThreadInput!) {
    unarchiveDirectMessageThread(input: $input) {
      id
    }
  }
`;
const UnarchiveDMThreadOptions = {
  props: ({ mutate }) => ({
    unarchiveDirectMessageThread: threadId =>
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
export default graphql(unarchiveDirectMessageThread, UnarchiveDMThreadOptions);
