// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
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
            sender: {
              ...ownProps.currentUser,
              totalReputation: 0,
              contextPermissions: {
                communityId: null,
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
          // Read the data from our cache for this query.
          const data = store.readQuery({
            query: getDMThreadMessageConnectionQuery,
            variables: {
              id: ownProps.thread,
            },
          });

          data.directMessageThread.messageConnection.edges.push({
            __typename: 'DirectMessageEdge',
            cursor: window.btoa(addMessage.id),
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
