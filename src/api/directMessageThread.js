// $FlowFixMe
import { graphql, gql } from 'react-apollo';
import { directMessageThreadInfoFragment } from './fragments/directMessageThread/directMessageThreadInfo';
import { userDirectMessageThreadsFragment } from './fragments/user/userDirectMessageThreads';
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
        update: (store, { data: { createDirectMessageThread } }) => {
          if (!createDirectMessageThread) return;
          const data = store.readQuery({
            query: GET_CURRENT_USER_DIRECT_MESSAGE_THREADS_QUERY,
          });

          data.user.directMessageThreadsConnection.edges.push({
            cursor: createDirectMessageThread.id,
            node: createDirectMessageThread,
            __typename: 'DirectMessageThreadEdge',
          });

          // Write our data back to the cache.
          store.writeQuery({
            query: GET_CURRENT_USER_DIRECT_MESSAGE_THREADS_QUERY,
            data,
          });
        },
      }),
  }),
};
export const createDirectMessageThreadMutation = graphql(
  CREATE_DIRECT_MESSAGE_THREAD_MUTATION,
  CREATE_DIRECT_MESSAGE_THREAD_OPTIONS
);

const LoadMoreDirectMessageThreads = gql`
  query loadMoreDirectMessageThreads($after: String) {
    user: currentUser {
      ...userInfo
      directMessageThreadsConnection(after: $after) {
        pageInfo {
          hasNextPage
        }
        edges {
          cursor
          node {
            ...directMessageThreadInfo
          }
        }
      }
    }
  }
  ${userInfoFragment}
  ${directMessageThreadInfoFragment}
`;

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
    fetchPolicy: 'cache-and-network',
  },
  props: props => ({
    ...props,
    hasNextPage: props.data.user
      ? props.data.user.directMessageThreadsConnection.pageInfo.hasNextPage
      : false,
    fetchMore: () =>
      props.data.fetchMore({
        query: LoadMoreDirectMessageThreads,
        variables: {
          after:
            props.data.user.directMessageThreadsConnection.edges[
              props.data.user.directMessageThreadsConnection.edges.length - 1
            ].cursor,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult.user) {
            return prev;
          }

          const foo = {
            ...prev,
            user: {
              ...prev.user,
              directMessageThreadsConnection: {
                ...prev.user.directMessageThreadsConnection,
                pageInfo: {
                  ...prev.user.directMessageThreadsConnection.pageInfo,
                  ...fetchMoreResult.user.directMessageThreadsConnection
                    .pageInfo,
                },
                edges: [
                  ...prev.user.directMessageThreadsConnection.edges,
                  ...fetchMoreResult.user.directMessageThreadsConnection.edges,
                ],
              },
            },
          };
          return foo;
        },
      }),
    subscribeToUpdatedDirectMessageThreads: () => {
      return props.data.subscribeToMore({
        document: subscribeToUpdatedDirectMessageThreads,
        updateQuery: (prev, { subscriptionData }) => {
          const updatedDirectMessageThread =
            subscriptionData.data.directMessageThreadUpdated;
          if (!updatedDirectMessageThread) return prev;

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
