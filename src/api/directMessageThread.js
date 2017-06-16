// @flow
// $FlowFixMe
import { graphql, gql } from 'react-apollo';
import {
  directMessageThreadInfoFragment,
} from './fragments/directMessageThread/directMessageThreadInfo';
import {
  userDirectMessageThreadsFragment,
} from './fragments/user/userDirectMessageThreads';
import { userInfoFragment } from './fragments/user/userInfo';
import { subscribeToUpdatedDirectMessageThreads } from './subscriptions';

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
  options: {
    refetchQueries: ['currentUserDirectMessageThreads'],
  },
  props: ({ input, mutate }) => ({
    createDirectMessageThread: input =>
      mutate({
        variables: {
          input,
        },
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
      ...userInfo
      ...userDirectMessageThreads
    }
  }
  ${userInfoFragment}
  ${userDirectMessageThreadsFragment}
`;

export const GET_CURRENT_USER_DIRECT_MESSAGE_THREADS_OPTIONS = {
  options: {
    fetchPolicy: 'network-only',
  },
  props: props => ({
    ...props,
    subscribeToUpdatedDirectMessageThreads: () => {
      return props.data.subscribeToMore({
        document: subscribeToUpdatedDirectMessageThreads,
        updateQuery: (prev, { subscriptionData }) => {
          const updatedDirectMessageThread =
            subscriptionData.data.directMessageThreadUpdated;
          if (!updatedDirectMessageThread) return prev;

          const threadNode = {
            ...updatedDirectMessageThread,
            __typename: 'DirectMessageThread',
          };

          console.log('prev', prev);
          console.log('subscriptionData', subscriptionData);

          // Add the new notification to the data
          return Object.assign({}, prev, {
            ...prev,
            directMessageThreadsConnection: {
              ...prev.user.directMessageThreadsConnection,
              edges: [
                ...prev.user.directMessageThreadsConnection.edges,
                {
                  node: updatedDirectMessageThread,
                  cursor: '__this-is-a-cursor__',
                  __typename: 'DirectMessageThread',
                },
              ],
            },
          });
        },
      });
    },
  }),
};

export const getCurrentUserDirectMessageThreads = graphql(
  GET_CURRENT_USER_DIRECT_MESSAGE_THREADS_QUERY,
  GET_CURRENT_USER_DIRECT_MESSAGE_THREADS_OPTIONS
);

/*
  Set a user's last seen state in the db
*/
const SET_LAST_SEEN_MUTATION = gql`
  mutation setLastSeen($id: ID!) {
    setLastSeen(id: $id) {
      ...directMessageThreadInfo
    }
  }
  ${directMessageThreadInfoFragment}
`;
const SET_LAST_SEEN_OPTIONS = {
  props: ({ id, mutate }) => ({
    setLastSeen: id =>
      mutate({
        variables: {
          id,
        },
      }),
  }),
};
export const setLastSeenMutation = graphql(
  SET_LAST_SEEN_MUTATION,
  SET_LAST_SEEN_OPTIONS
);

/*
  Get all media messages for a threadId to populate the gallery
*/
export const GET_DIRECT_MESSAGE_THREAD_QUERY = gql`
  query getDirectMessageThread($id: ID!) {
    directMessageThread(id: $id) {
      ...directMessageThreadInfo
    }
  }
  ${directMessageThreadInfoFragment}
`;

export const GET_DIRECT_MESSAGE_THREAD_OPTIONS = {
  options: ({ id }) => ({
    variables: {
      id,
    },
    fetchPolicy: 'cache-and-network',
  }),
};

export const getDirectMessageThread = graphql(
  GET_DIRECT_MESSAGE_THREAD_QUERY,
  GET_DIRECT_MESSAGE_THREAD_OPTIONS
);
