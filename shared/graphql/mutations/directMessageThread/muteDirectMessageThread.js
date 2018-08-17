// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { getCurrentUserDMThreadConnectionQuery } from 'shared/graphql/queries/directMessageThread/getCurrentUserDMThreadConnection';

export const muteDirectMessageThread = gql`
  mutation muteDirectMessageThread($input: MuteDirectMessageThreadInput!) {
    muteDirectMessageThread(input: $input) {
      id
      isMuted
    }
  }
`;

const muteDMThreadOptions = {
  props: ({ mutate }) => ({
    muteDirectMessageThread: threadId =>
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

export default graphql(muteDirectMessageThread, muteDMThreadOptions);
