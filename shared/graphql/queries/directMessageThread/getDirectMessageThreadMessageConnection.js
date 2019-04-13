// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { btoa } from 'b2a';
import { subscribeToNewMessages } from '../../subscriptions';
import directMessageThreadMessageConnectionFragment from '../../fragments/directMessageThread/directMessageThreadMessageConnection';
import type { DirectMessageThreadMessageConnectionType } from '../../fragments/directMessageThread/directMessageThreadMessageConnection';
import directMessageThreadInfoFragment from '../../fragments/directMessageThread/directMessageThreadInfo';
import type { DirectMessageThreadInfoType } from '../../fragments/directMessageThread/directMessageThreadInfo';

export type GetDirectMessageThreadMessageConnectionType = {
  ...$Exact<DirectMessageThreadInfoType>,
  ...$Exact<DirectMessageThreadMessageConnectionType>,
};

const LoadMoreMessages = gql`
  query loadMoreMessages($id: ID!, $after: String) {
    directMessageThread(id: $id) {
      ...directMessageThreadInfo
      ...directMessageThreadMessageConnection
    }
  }
  ${directMessageThreadInfoFragment}
  ${directMessageThreadMessageConnectionFragment}
`;

export const getDMThreadMessageConnectionQuery = gql`
  query getDirectMessageThreadMessages($id: ID!, $after: String) {
    directMessageThread(id: $id) {
      ...directMessageThreadInfo
      ...directMessageThreadMessageConnection
    }
  }
  ${directMessageThreadInfoFragment}
  ${directMessageThreadMessageConnectionFragment}
`;

export const getDMThreadMessageConnectionOptions = {
  options: ({ id }: { id: string }) => ({
    variables: {
      id,
    },
    fetchPolicy: 'cache-and-network',
  }),
  // $FlowFixMe
  props: ({ data: { directMessageThread }, data, ownProps, ...rest }) => ({
    ...rest,
    data: {
      ...data,
      messages:
        directMessageThread &&
        directMessageThread.messageConnection &&
        directMessageThread.messageConnection.edges,
      messageConnection:
        directMessageThread && directMessageThread.messageConnection,
      hasNextPage:
        directMessageThread && directMessageThread.messageConnection
          ? directMessageThread.messageConnection.pageInfo.hasNextPage
          : false,
      fetchMore: () =>
        data.fetchMore({
          query: LoadMoreMessages,
          variables: {
            id: directMessageThread.id,
            after:
              directMessageThread.messageConnection.edges[
                directMessageThread.messageConnection.edges.length - 1
              ].cursor,
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult.directMessageThread) {
              return prev;
            }

            return {
              ...prev,
              directMessageThread: {
                ...prev.directMessageThread,
                messageConnection: {
                  ...prev.directMessageThread.messageConnection,
                  pageInfo: {
                    ...prev.directMessageThread.messageConnection.pageInfo,
                    ...fetchMoreResult.directMessageThread.messageConnection
                      .pageInfo,
                  },
                  edges: [
                    ...prev.directMessageThread.messageConnection.edges,
                    ...fetchMoreResult.directMessageThread.messageConnection
                      .edges,
                  ],
                },
              },
            };
          },
        }),
    },
    subscribeToNewMessages: () => {
      return data.subscribeToMore({
        document: subscribeToNewMessages,
        variables: {
          thread: ownProps.id,
        },
        updateQuery: (prev, { subscriptionData }) => {
          const newMessage = subscriptionData.data.messageAdded;
          const existingMessage = prev.directMessageThread.messageConnection.edges.find(
            // Check whether we have a node with the same ID or an optimistic response
            // with the same content
            // NOTE(@mxstbr): Checking for equality in the content is very brittle, what if we change the content on the server?
            // I couldn't find a better way to do this for now, ref withspectrum/spectrum#2328
            ({ node }) =>
              node.id === newMessage.id ||
              (typeof node.id === 'number' &&
                node.content.body === newMessage.content.body)
          );
          // If there is an optimstic update with the same content that wasn't replaced yet, replace it
          if (existingMessage && typeof existingMessage.node.id === 'number') {
            return {
              ...prev,
              thread: {
                ...prev.directMessageThread,
                messageConnection: {
                  ...prev.directMessageThread.messageConnection,
                  edges: prev.directMessageThread.messageConnection.edges.map(
                    edge => {
                      // Replace the optimstic update with the actual db message
                      if (edge.node.id === existingMessage.id)
                        return {
                          ...edge,
                          cursor: btoa(newMessage.id),
                          node: newMessage,
                        };

                      return edge;
                    }
                  ),
                },
              },
            };
            // If the message is already in the state because the mutation already
            // added it, ignore it and don't duplicate it
          } else if (existingMessage) {
            return prev;
          }

          // Add the new message to the data
          return Object.assign({}, prev, {
            ...prev,
            directMessageThread: {
              ...prev.directMessageThread,
              messageConnection: {
                ...prev.directMessageThread.messageConnection,
                edges: [
                  ...prev.directMessageThread.messageConnection.edges,
                  {
                    node: newMessage,
                    cursor: btoa(newMessage.id),
                    __typename: 'DirectMessageEdge',
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

export default graphql(
  getDMThreadMessageConnectionQuery,
  getDMThreadMessageConnectionOptions
);
