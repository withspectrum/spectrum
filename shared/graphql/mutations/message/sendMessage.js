// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { btoa } from 'b2a';
import snarkdown from 'snarkdown';
import messageInfoFragment from '../../fragments/message/messageInfo';
import communityInfoFragment from '../../fragments/community/communityInfo';
import type { MessageInfoType } from '../../fragments/message/messageInfo';
import { getThreadMessageConnectionQuery } from '../../queries/thread/getThreadMessageConnection';
import { messageTypeObj } from 'shared/draft-utils/message-types';

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
    sendMessage: async (message, author) => {
      const fakeId = Math.round(Math.random() * -1000000);
      return mutate({
        variables: {
          message: {
            ...message,
            messageType:
              message.messageType === messageTypeObj.media
                ? messageTypeObj.media
                : messageTypeObj.text,
            content: {
              body:
                message.messageType === messageTypeObj.media
                  ? ''
                  : message.content.body,
            },
          },
        },
        optimisticResponse: {
          __typename: 'Mutation',
          addMessage: {
            id: fakeId,
            timestamp: JSON.parse(JSON.stringify(new Date())),
            bot: false,
            messageType:
              message.messageType === messageTypeObj.media
                ? messageTypeObj.media
                : 'optimistic',
            modifiedAt: '',
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
              body:
                message.messageType === messageTypeObj.media
                  ? message.content.body
                  : snarkdown(message.content.body),
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

          // Replace the optimistic response with the actual db message
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
            // If it's an actual duplicate because the subscription already added the message to the store
            // only set lastActive and currentUserLastSeen
          } else if (messageInStore) {
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
            data: {
              ...data,
              thread: {
                ...data.thread,
                // Optimistically update lastActive and lastSeen to make sure the
                // feed ordering is the way users expect it to be
                lastActive: addMessage.timestamp,
                currentUserLastSeen: new Date(
                  new Date(addMessage.timestamp).getTime() + 1000
                ).toISOString(),
              },
            },
            variables: {
              id: message.threadId,
            },
          });

          const community = store.readFragment({
            fragment: communityInfoFragment,
            fragmentName: 'communityInfo',
            id: `Community:${data.thread.community.slug}`,
          });

          store.writeFragment({
            fragment: communityInfoFragment,
            fragmentName: 'communityInfo',
            id: `Community:${data.thread.community.slug}`,
            data: {
              ...community,
              communityPermissions: {
                ...community.communityPermissions,
                // Forward-date lastSeen by 10 seconds
                lastSeen: new Date(Date.now() + 10000).toISOString(),
              },
            },
          });
        },
      });
    },
  }),
};

export default graphql(sendMessageMutation, sendMessageOptions);
