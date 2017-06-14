// @flow
// $FlowFixMe
import { graphql, gql } from 'react-apollo';
import { subscribeToNewMessages } from '../../api/subscriptions';
import { userInfoFragment } from '../../api/fragments/user/userInfo';
import { messageInfoFragment } from '../../api/fragments/message/messageInfo';
import {
  directMessageThreadInfoFragment,
} from '../../api/fragments/directMessageThread/directMessageThreadInfo';

export const GET_DIRECT_MESSAGE_THREAD_QUERY = gql`
  query getDirectMessageThreadMessages($id: ID!) {
    directMessageThread(id: $id) {
      ...directMessageThreadInfo
      messageConnection {
        edges {
          node {
            ...messageInfo
          }
        }
      }
    }
  }
  ${directMessageThreadInfoFragment}
  ${userInfoFragment}
  ${messageInfoFragment}
`;

export const GET_DIRECT_MESSAGE_THREAD_OPTIONS = {
  options: ({ id }) => ({
    variables: {
      id,
    },
    fetchPolicy: 'cache-and-network',
  }),
  props: ({
    data: { error, loading, directMessageThread, subscribeToMore },
    ownProps,
  }) => ({
    data: {
      error,
      loading,
      messages: directMessageThread
        ? directMessageThread.messageConnection.edges
        : '',
    },
    subscribeToNewMessages: () => {
      if (!directMessageThread) {
        return;
      }
      return subscribeToMore({
        document: subscribeToNewMessages,
        variables: {
          thread: ownProps.id,
        },
        updateQuery: (prev, { subscriptionData }) => {
          const newMessage = subscriptionData.data.messageAdded;
          // Add the new message to the data
          return Object.assign({}, prev, {
            ...prev,
            directMessageThread: {
              ...prev.directMessageThread,
              messageConnection: {
                ...prev.directMessageThread.messageConnection,
                edges: [
                  ...prev.directMessageThread.messageConnection.edges,
                  // NOTE(@mxstbr): The __typename hack is to work around react-apollo/issues/658
                  {
                    node: newMessage,
                    __typename: 'DirectMessageThreadMessageEdge',
                  },
                ],
              },
            },
          });
        },
      });
    },
  }),
};

export const getDirectMessageThreadMessages = graphql(
  GET_DIRECT_MESSAGE_THREAD_QUERY,
  GET_DIRECT_MESSAGE_THREAD_OPTIONS
);
