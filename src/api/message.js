// @flow
// $FlowFixMe
import { graphql, gql } from 'react-apollo';
import { messageInfoFragment } from './fragments/message/messageInfo';
import { GET_THREAD_MESSAGES_QUERY } from '../views/thread/queries';

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
    sendMessage: message =>
      mutate({
        variables: {
          message,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          addMessage: {
            __typename: 'Message',
            sender: {
              ...ownProps.currentUser,
              __typename: 'User',
            },
            timestamp: +new Date(),
            content: {
              ...message.content,
              __typename: 'MessageContent',
            },
            id: Math.round(Math.random() * -1000000),
            reactions: [],
            messageType: message.messageType,
          },
        },
        update: (store, { data: { addMessage } }) => {
          if (ownProps.threadType === 'story') {
            // Read the data from our cache for this query.
            const data = store.readQuery({
              query: GET_THREAD_MESSAGES_QUERY,
              variables: {
                id: ownProps.thread,
              },
            });

            // Add our comment from the mutation to the end.
            data.thread.messageConnection.edges.push({
              node: addMessage,
              __typename: 'ThreadMessageEdge',
            });
            console.log('data updated', data);
            // Write our data back to the cache.
            store.writeQuery({
              query: GET_THREAD_MESSAGES_QUERY,
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
      id,
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
