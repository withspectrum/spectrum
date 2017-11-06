// @flow
// $FlowFixMe
import { graphql, gql } from 'react-apollo';
import { messageInfoFragment } from './fragments/message/messageInfo';
import { GET_THREAD_MESSAGES_QUERY } from '../views/thread/queries';
import { GET_DIRECT_MESSAGE_THREAD_QUERY } from '../views/directMessages/queries';

const DELETE_MESSAGE_MUTATION = gql`
  mutation deleteMessage($id: ID!) {
    deleteMessage(id: $id)
  }
`;
const DELETE_MESSAGE_OPTIONS = {
  props: ({ ownProps, mutate }) => ({
    ...ownProps,
    deleteMessage: id =>
      mutate({
        variables: {
          id,
        },
        update: store => {
          // we have to split out the optimistic update by thread type
          // because DMs and story threads have different queries and response
          // shapes
          if (ownProps.threadType === 'story') {
            // Read the data from our cache for this query.
            const data = store.readQuery({
              query: GET_THREAD_MESSAGES_QUERY,
              variables: {
                id: ownProps.threadId,
              },
            });

            data.thread.messageConnection.edges = data.thread.messageConnection.edges.filter(
              ({ node }) => node.id !== id
            );

            // Write our data back to the cache.
            store.writeQuery({
              query: GET_THREAD_MESSAGES_QUERY,
              data,
              variables: {
                id: ownProps.threadId,
              },
            });
          } else if (ownProps.threadType === 'directMessageThread') {
            // Read the data from our cache for this query.
            const data = store.readQuery({
              query: GET_DIRECT_MESSAGE_THREAD_QUERY,
              variables: {
                id: ownProps.threadId,
              },
            });

            data.directMessageThread.messageConnection.edges = data.directMessageThread.messageConnection.edges.filter(
              message => message.id !== id
            );
            // Write our data back to the cache.
            store.writeQuery({
              query: GET_DIRECT_MESSAGE_THREAD_QUERY,
              data,
              variables: {
                id: ownProps.threadId,
              },
            });
          }
        },
      }),
  }),
};
export const deleteMessage = graphql(
  DELETE_MESSAGE_MUTATION,
  DELETE_MESSAGE_OPTIONS
);

/*
  Updates UI automatically via the containers subscribeToNewMessages helper
*/
const SEND_MESSAGE_MUTATION = gql`
  mutation sendMessage($message: MessageInput!) {
    addMessage(message: $message) {
      ...messageInfo
      thread {
        id
        receiveNotifications
      }
    }
  }
  ${messageInfoFragment}
`;
const SEND_MESSAGE_OPTIONS = {
  props: ({ ownProps, mutate }) => ({
    sendMessage: message =>
      mutate({
        variables: {
          message: {
            ...message,
            content: {
              body: message.messageType === 'media' ? '' : message.content.body,
            },
          },
        },
        optimisticResponse: {
          __typename: 'Mutation',
          addMessage: {
            __typename: 'Message',
            thread: {
              id: ownProps.thread,
              receiveNotifications: true,
              __typename: 'Thread',
            },
            sender: {
              ...ownProps.currentUser,
              contextPermissions: {
                reputation: 0,
                isOwner: false,
                isModerator: false,
                __typename: 'ContextPermissions',
              },
              __typename: 'User',
            },
            timestamp: +new Date(),
            content: {
              ...message.content,
              __typename: 'MessageContent',
            },
            id: Math.round(Math.random() * -1000000),
            reactions: {
              count: 0,
              hasReacted: false,
              __typename: 'ReactionData',
            },
            messageType: message.messageType,
          },
        },
        update: (store, { data: { addMessage } }) => {
          // we have to split out the optimistic update by thread type
          // because DMs and story threads have different queries and response
          // shapes
          if (ownProps.threadType === 'story') {
            // Read the data from our cache for this query.
            const data = store.readQuery({
              query: GET_THREAD_MESSAGES_QUERY,
              variables: {
                id: ownProps.thread,
              },
            });

            // ignore the addMessage from the server, apollo will automatically
            // override the optimistic object
            if (
              !addMessage ||
              (typeof addMessage.id === 'string' &&
                addMessage.messageType === 'text')
            ) {
              return;
            }

            data.thread.messageConnection.edges.push({
              cursor: addMessage.id,
              node: addMessage,
              __typename: 'ThreadMessageEdge',
            });

            // Write our data back to the cache.
            store.writeQuery({
              query: GET_THREAD_MESSAGES_QUERY,
              data,
              variables: {
                id: ownProps.thread,
              },
            });
          } else if (ownProps.threadType === 'directMessageThread') {
            // Read the data from our cache for this query.
            const data = store.readQuery({
              query: GET_DIRECT_MESSAGE_THREAD_QUERY,
              variables: {
                id: ownProps.thread,
              },
            });

            // ignore the addMessage from the server, apollo will automatically
            // override the optimistic object
            if (!addMessage || typeof addMessage.id === 'string') {
              return;
            }

            data.directMessageThread.messageConnection.edges.push({
              cursor: addMessage.id,
              node: addMessage,
              __typename: 'DirectMessageEdge',
            });
            // Write our data back to the cache.
            store.writeQuery({
              query: GET_DIRECT_MESSAGE_THREAD_QUERY,
              data,
              variables: {
                id: ownProps.thread,
              },
            });
          }
        },
      }),
  }),
};
export const sendMessageMutation = graphql(
  SEND_MESSAGE_MUTATION,
  SEND_MESSAGE_OPTIONS
);

/*
  Get all media messages for a threadId to populate the gallery
*/
const GET_MEDIA_MESSAGES_FOR_THREAD_QUERY = gql`
  query getMediaMessagesForThread($threadId: ID!) {
    getMediaMessagesForThread(threadId: $threadId) {
      id
      content {
        body
      }
    }
  }
`;

const GET_MEDIA_MESSAGES_FOR_THREAD_OPTIONS = {
  options: ({ threadId }) => ({
    variables: {
      threadId,
    },
    fetchPolicy: 'network-only',
  }),
  props: ({ data: { error, loading, getMediaMessagesForThread } }) => ({
    data: {
      error,
      loading,
      getMediaMessagesForThread,
      messages: getMediaMessagesForThread ? getMediaMessagesForThread : '',
    },
  }),
};

export const getMediaMessagesForThread = graphql(
  GET_MEDIA_MESSAGES_FOR_THREAD_QUERY,
  GET_MEDIA_MESSAGES_FOR_THREAD_OPTIONS
);
