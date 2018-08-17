// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { getCurrentUserDMThreadConnectionQuery } from 'shared/graphql/queries/directMessageThread/getCurrentUserDMThreadConnection';

export const unmuteDirectMessageThread = gql`
  mutation unmuteDirectMessageThread($input: UnmuteDirectMessageThreadInput!) {
    unmuteDirectMessageThread(input: $input) {
      id
      isMuted
    }
  }
`;

const unmuteDMThreadOptions = {
  props: ({ mutate }) => ({
    unmuteDirectMessageThread: threadId =>
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

export default graphql(unmuteDirectMessageThread, unmuteDMThreadOptions);
