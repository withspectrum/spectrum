// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { getCurrentUserDMThreadConnectionQuery } from 'shared/graphql/queries/directMessageThread/getCurrentUserDMThreadConnection';

export const archiveDirectMessageThread = gql`
  mutation archiveDirectMessageThread($input: archiveDMThreadInput!) {
    archiveDirectMessageThread(input: $input) {
      id
    }
  }
`;
const ArchiveDMThreadOptions = {
  props: ({ mutate }) => ({
    archiveDirectMessageThread: threadId =>
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
export default graphql(archiveDirectMessageThread, ArchiveDMThreadOptions);
