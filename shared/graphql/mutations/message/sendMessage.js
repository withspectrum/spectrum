// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import messageInfoFragment from '../../fragments/message/messageInfo';
import type { MessageInfoType } from '../../fragments/message/messageInfo';
import { getThreadMessageConnectionQuery } from '../../queries/thread/getThreadMessageConnection';

export type SendMessageType = {
  data: {
    addMessage: {
      ...$Exact<MessageInfoType>,
    },
  },
};

export const sendMessageMutation = gql`
  mutation sendMessage($message: MessageInput!) {
    addMessage(message: $message) {
      ...messageInfo
    }
  }
  ${messageInfoFragment}
`;

const sendMessageOptions = {
  props: ({ ownProps, mutate }) => ({
    sendMessage: message => {
      const fakeId = Math.round(Math.random() * -1000000);
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
          __typename: 'Mutation',
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
        update: (store, { data: { addMessage } }) => {
          const data = store.readQuery({
            query: getThreadMessageConnectionQuery,
            variables: {
              id: ownProps.thread,
            },
          });

          const hasMessageInStore = data.thread.messageConnection.edges.find(
            ({ node }) => node.id === addMessage.id
          );

          // If the message is in the state because the subscription already
          // added it, don't add it another time
          if (hasMessageInStore) return;

          data.thread.messageConnection.edges.push({
            __typename: 'ThreadMessageEdge',
            cursor: window.btoa(addMessage.id),
            node: addMessage,
          });

          // Write our data back to the cache.
          store.writeQuery({
            query: getThreadMessageConnectionQuery,
            data,
            variables: {
              id: ownProps.thread,
            },
          });
        },
      });
    },
  }),
};

export default graphql(sendMessageMutation, sendMessageOptions);
