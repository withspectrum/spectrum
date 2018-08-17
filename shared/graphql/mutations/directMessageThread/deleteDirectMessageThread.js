// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { getCurrentUserDMThreadConnectionQuery } from 'shared/graphql/queries/directMessageThread/getCurrentUserDMThreadConnection';

export const deleteDirectMessageThread = gql`
  mutation deleteDirectMessageThread($input: DeleteDirectMessageThreadInput!) {
    deleteDirectMessageThread(input: $input) {
      id
      isdeleted
    }
  }
`;

const deleteDMThreadOptions = {
  props: ({ mutate }) => ({
    deleteDirectMessageThread: threadId =>
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

export default graphql(deleteDirectMessageThread, deleteDMThreadOptions);
