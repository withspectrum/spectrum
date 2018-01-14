// @flow
// $FlowFixMe
import { graphql, gql } from 'react-apollo';
import { messageInfoFragment } from './fragments/message/messageInfo';
import { userInfoFragment } from './fragments/user/userInfo';
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
    }
  }
  ${messageInfoFragment}
`;
const SEND_MESSAGE_OPTIONS = {
  props: ({ ownProps, mutate }) => ({
    sendMessage: message => {
      console.log('---BEGIN SEND MESSAGE---');
      console.log('[sendMessage] new message:', message);
      const fakeId = Math.round(Math.random() * -1000000);
      console.log('[sendMessage] fake ID:', fakeId);
      console.log('[sendMessage] calling mutate');
      console.log('---END SEND MESSAGE---\n\n');
      return mutate({
        variables: {
          message: {
            ...message,
            content: {
              body: message.messageType === 'media' ? '' : message.content.body,
            },
          },
        },
        optimisticResponse: {
          addMessage: {
            id: fakeId,
            timestamp: JSON.parse(JSON.stringify(new Date())),
            messageType: message.messageType,
            sender: {
              ...ownProps.currentUser,
              totalReputation: 0,
              contextPermissions: {
                communityId: ownProps.threadData.community.id,
                reputation: 0,
                isOwner: false,
                isModerator: false,
                __typename: 'ContextPermissions',
              },
              __typename: 'User',
            },
            content: {
              ...message.content,
              __typename: 'MessageContent',
            },
            reactions: {
              count: 0,
              hasReacted: false,
              __typename: 'ReactionData',
            },
            __typename: 'Message',
          },
        },
        update: (store, { data: { addMessage }, data: object }) => {
          console.log('---BEGIN UPDATE---');
          if (typeof addMessage.id === 'string') {
            console.log('[update] New message from server, ignoring');
            console.log('---END UPDATE---');
            return;
          } else {
            console.log('[update] New optimistic response for message');
          }
          console.log(addMessage);
          console.log(
            `[update] readQuery for thread messages of thread#${ownProps.thread}`
          );
          // Read the data from our cache for this query.
          const data = store.readQuery({
            query: GET_THREAD_MESSAGES_QUERY,
            variables: {
              id: ownProps.thread,
            },
          });

          console.log(
            `[update] data for thread message query for thread#${ownProps.thread}:`,
            data
          );

          console.log('[update] add message to messageConnection');
          data.thread.messageConnection.edges.push({
            __typename: 'ThreadMessageEdge',
            cursor: window.btoa(addMessage.id),
            node: addMessage,
          });
          console.log('[update] message added:', data.thread.messageConnection);

          console.log(
            `[update] writeQuery with message added for thread#${ownProps.thread}`
          );
          // Write our data back to the cache.
          store.writeQuery({
            query: GET_THREAD_MESSAGES_QUERY,
            data,
            variables: {
              id: ownProps.thread,
            },
          });
          console.log('[update] message written to store');
          console.log('---END UPDATE---\n\n');
          // } else if (ownProps.threadType === 'directMessageThread') {
          //   // Read the data from our cache for this query.
          //   const data = store.readQuery({
          //     query: GET_DIRECT_MESSAGE_THREAD_QUERY,
          //     variables: {
          //       id: ownProps.thread,
          //     },
          //   });

          //   // ignore the addMessage from the server, apollo will automatically
          //   // override the optimistic object
          //   if (!addMessage || typeof addMessage.id === 'string') {
          //     return;
          //   }

          //   data.directMessageThread.messageConnection.edges.push({
          //     cursor: addMessage.id,
          //     node: addMessage,
          //     __typename: 'DirectMessageEdge',
          //   });
          //   // Write our data back to the cache.
          //   store.writeQuery({
          //     query: GET_DIRECT_MESSAGE_THREAD_QUERY,
          //     data,
          //     variables: {
          //       id: ownProps.thread,
          //     },
          //   });
          // }
        },
      });
    },
  }),
};
export const sendMessageMutation = graphql(
  SEND_MESSAGE_MUTATION,
  SEND_MESSAGE_OPTIONS
);

const SEND_DIRECT_MESSAGE_MUTATION = gql`
mutation sendDirectMessage($message: MessageInput!) {
  addMessage(message: $message) {
    ...messageInfo
  }
}
${messageInfoFragment}
${userInfoFragment}
`;
const SEND_DIRECT_MESSAGE_OPTIONS = {
  props: ({ ownProps, mutate }) => ({
    sendDirectMessage: message =>
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
            sender: {
              ...ownProps.currentUser,
              contextPermissions: {
                communityId: null,
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
        },
      }),
  }),
};
export const sendDirectMessageMutation = graphql(
  SEND_DIRECT_MESSAGE_MUTATION,
  SEND_DIRECT_MESSAGE_OPTIONS
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
