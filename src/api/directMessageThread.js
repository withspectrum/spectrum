// @flow
// $FlowFixMe
import { graphql, gql } from 'react-apollo';
import {
  directMessageThreadInfoFragment,
} from './fragments/directMessageThread/directMessageThreadInfo';
import {
  userDirectMessageThreadsFragment,
} from './fragments/user/userDirectMessageThreads';

/*
  Create a new direct message group
  Input is:
  - an array of user ids
  - a thread-less "message" object

  Because we are creating a DM group for the first time, we need to send the
  message data to the backend to store it after the DM group is created
  and we have a threadID
*/
const CREATE_DIRECT_MESSAGE_THREAD_MUTATION = gql`
  mutation createDirectMessageThread($input: DirectMessageThreadInput!) {
    createDirectMessageThread(input: $input) {
      ...directMessageThreadInfo
    }
  }
  ${directMessageThreadInfoFragment}
`;
const CREATE_DIRECT_MESSAGE_THREAD_OPTIONS = {
  props: ({ input, mutate }) => ({
    createDirectMessageThread: input =>
      mutate({
        variables: {
          input,
        },
        // NOTE: I tried each of the three methods to update the Apollo store
        // and couldn't get any of them to work. Very frustrating that this
        // is so difficult.
        // refetchQueries: [{
        //   query: GET_CURRENT_USER_DIRECT_MESSAGE_THREADS_QUERY
        // }]
        // update: (store, { data: { createDirectMessageThread } }) => {
        //   const data = store.readQuery({ query: GET_CURRENT_USER_DIRECT_MESSAGE_THREADS_QUERY })
        //   console.log('data', data)
        //   console.log('returned data', createDirectMessageThread)
        //   data.user.directMessageThreadsConnection.edges.push({
        //     node: createDirectMessageThread
        //   })
        //   console.log('post-push: ', data)
        //   store.writeQuery({ query: GET_CURRENT_USER_DIRECT_MESSAGE_THREADS_QUERY, data })
        // }
        // updateQueries: {
        //   getCurrentUserDirectMessageThreads: (prev, { mutationResult }) => {
        //     const newThread = mutationResult.data.createDirectMessageThread;
        //
        //     return Object.assign({}, prev, {
        //       ...prev,
        //       user: {
        //         ...prev.user,
        //         directMessageThreadsConnection: {
        //           ...prev.user.directMessageThreadsConnection,
        //           edges: [
        //             ...prev.user.directMessageThreadsConnection.edges,
        //             {
        //               node: {
        //                 ...newThread
        //               }
        //             }
        //           ]
        //         }
        //       }
        //     });
        //   },
        // },
      }),
  }),
};
export const createDirectMessageThreadMutation = graphql(
  CREATE_DIRECT_MESSAGE_THREAD_MUTATION,
  CREATE_DIRECT_MESSAGE_THREAD_OPTIONS
);

export const GET_CURRENT_USER_DIRECT_MESSAGE_THREADS_QUERY = gql`
  query currentUserDirectMessageThreads {
    user: currentUser {
      ...userDirectMessageThreads
    }
  }
  ${userDirectMessageThreadsFragment}
`;

export const getCurrentUserDirectMessageThreads = graphql(
  GET_CURRENT_USER_DIRECT_MESSAGE_THREADS_QUERY
);
