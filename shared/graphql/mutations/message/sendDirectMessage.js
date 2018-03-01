// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { btoa } from 'abab';
import messageInfoFragment from '../../fragments/message/messageInfo';
import type { MessageInfoType } from '../../fragments/message/messageInfo';
import { getDMThreadMessageConnectionQuery } from '../../queries/directMessageThread/getDirectMessageThreadMessageConnection';

export type SendDirectMessageType = {
  ...$Exact<MessageInfoType>,
};

export const sendDirectMessageMutation = gql`
  mutation sendDirectMessage($message: MessageInput!) {
    addMessage(message: $message) {
      ...messageInfo
    }
  }
  ${messageInfoFragment}
`;
const sendDirectMessageOptions = {
  props: ({ ownProps, mutate }) => ({
    sendDirectMessage: message => {
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
                ...ownProps.currentUser,
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
          // Read the data from our cache for this query.
          const data = store.readQuery({
            query: getDMThreadMessageConnectionQuery,
            variables: {
              id: ownProps.thread,
            },
          });

          const messageInStore = data.directMessageThread.messageConnection.edges.find(
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
          if (messageInStore && typeof messageInStore.id === 'number') {
            data.directMessageThread.messageConnection.edges = data.directMessageThread.messageConnection.edges.map(
              edge => {
                if (edge.node.id === messageInStore.id)
                  return {
                    ...edge,
                    cursor: btoa(addMessage.id),
                    node: addMessage,
                  };
                return edge;
              }
            );
            // If it's an actual duplicate because the subscription already added the message to the store then ignore
          } else if (messageInStore) {
            return;
            // If it's a totally new message (i.e. the optimstic response) then insert it at the end
          } else {
            data.directMessageThread.messageConnection.edges.push({
              __typename: 'DirectMessageEdge',
              cursor: btoa(addMessage.id),
              node: addMessage,
            });
          }

          data.directMessageThread.messageConnection.edges.push({
            __typename: 'DirectMessageEdge',
            cursor: btoa(addMessage.id),
            node: addMessage,
          });

          // Write our data back to the cache.
          store.writeQuery({
            query: getDMThreadMessageConnectionQuery,
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

export default graphql(sendDirectMessageMutation, sendDirectMessageOptions);
