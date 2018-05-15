// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import type { DirectMessageThreadInfoType } from '../../fragments/directMessageThread/directMessageThreadInfo';

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
      }),
  }),
};
export default graphql(archiveDirectMessageThread, ArchiveDMThreadOptions);
