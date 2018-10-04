// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { btoa } from 'b2a';
import messageInfoFragment from '../../fragments/message/messageInfo';
import type { MessageInfoType } from '../../fragments/message/messageInfo';
import { getThreadMessageConnectionQuery } from '../../queries/thread/getThreadMessageConnection';
import communityInfoFragment from '../../fragments/community/communityInfo';
import communityMemberInfoFragment from '../../fragments/communityMember/communityMemberInfo';
import threadInfoFragment from '../../fragments/thread/threadInfo';

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
    sendMessage: (message, author) => {
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
            author: {
              user: {
                ...(ownProps.currentUser || author),
                __typename: 'User',
              },
              isMember: true,
              isModerator: false,
              isOwner: false,
              isBlocked: false,
              reputation: 0,
              roles: [],
              __typename: 'ThreadParticipant',
            },
            parent: message.parentId
              ? {
                  __typename: 'Message',
                  id: message.parentId,
                  // TODO(@mxstbr): Get the rest of information
                }
              : null,
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
          const parentMessage =
            message.parentId &&
            store.readFragment({
              fragment: messageInfoFragment,
              fragmentName: 'messageInfo',
              id: `Message:${message.parentId}`,
            });
          const thread = store.readFragment({
            fragment: threadInfoFragment,
            fragmentName: 'threadInfo',
            id: `Thread:${message.threadId}`,
          });

          addMessage = {
            ...addMessage,
            parent: parentMessage || addMessage.parent,
            author: thread
              ? {
                  ...addMessage.author,
                  ...thread.community.communityPermissions,
                  __typename: 'ThreadParticipant',
                }
              : addMessage.author,
          };

          const data = store.readQuery({
            query: getThreadMessageConnectionQuery,
            variables: {
              id: message.threadId,
            },
          });

          const messageInStore = data.thread.messageConnection.edges.find(
            // Check whether we have a node with the same ID or an optimistic response
            // with the same content
            // NOTE(@mxstbr): Checking for equality in the content is very brittle, what if we change the content on the server?
            // I couldn't find a better way to do this for now, ref withspectrum/spectrum#2328
            ({ node }) =>
              node.id === addMessage.id ||
              (typeof node.id === 'number' &&
                node.content.body === addMessage.content.body)
          );

          // Replace the optimistic reponse with the actual db message
          if (messageInStore && typeof messageInStore.node.id === 'number') {
            data.thread.messageConnection.edges = data.thread.messageConnection.edges.map(
              edge => {
                if (edge.node.id === messageInStore.node.id) {
                  return {
                    ...edge,
                    cursor: btoa(addMessage.id),
                    node: addMessage,
                  };
                }
                return edge;
              }
            );
            // If it's an actual duplicate because the subscription already added the message to the store then ignore
          } else if (messageInStore) {
            return;
            // If it's a totally new message (i.e. the optimstic response) then insert it at the end
          } else {
            data.thread.messageConnection.edges.push({
              __typename: 'ThreadMessageEdge',
              cursor: btoa(addMessage.id),
              node: addMessage,
            });
          }

          // Write our data back to the cache.
          store.writeQuery({
            query: getThreadMessageConnectionQuery,
            data,
            variables: {
              id: message.threadId,
            },
          });
        },
      });
    },
  }),
};

export default graphql(sendMessageMutation, sendMessageOptions);
