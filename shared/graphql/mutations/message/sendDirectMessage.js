// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import messageInfoFragment from '../../fragments/message/messageInfo';
import type { MessageInfoType } from '../../fragments/message/messageInfo';
import { getDMThreadMessageConnectionQuery } from '../../queries/directMessageThread/getDirectMessageThreadMessageConnection';

export type SendDirectMessageType = {
  ...$Exact<MessageInfoType>,
};

const sendDirectMessageMutation = gql`
  mutation sendDirectMessage($message: MessageInput!) {
    addMessage(message: $message) {
      ...messageInfo
    }
  }
  ${messageInfoFragment}
`;
const sendDirectMessageOptions = {
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
          // ignore the addMessage from the server, apollo will automatically
          // override the optimistic object
          if (!addMessage || typeof addMessage.id === 'string') {
            return;
          }

          // Read the data from our cache for this query.
          const data = store.readQuery({
            query: getDMThreadMessageConnectionQuery,
            variables: {
              id: ownProps.thread,
            },
          });

          data.directMessageThread.messageConnection.edges.push({
            cursor: addMessage.id,
            node: addMessage,
            __typename: 'DirectMessageEdge',
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
      }),
  }),
};

export default graphql(sendDirectMessageMutation, sendDirectMessageOptions);
