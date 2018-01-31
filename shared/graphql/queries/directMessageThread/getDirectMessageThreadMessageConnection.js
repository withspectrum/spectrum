// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
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
        directMessageThread && directMessageThread.messageConnection.edges,
      hasNextPage: directMessageThread
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
      if (!directMessageThread) {
        return;
      }
      return data.subscribeToMore({
        document: subscribeToNewMessages,
        variables: {
          thread: ownProps.id,
        },
        updateQuery: (prev, { subscriptionData }) => {
          const newMessage = subscriptionData.data.messageAdded;
          const existingMessage = prev.directMessageThread.messageConnection.edges.find(
            ({ node }) => node.id === newMessage.id
          );
          if (existingMessage) return prev;
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
                    cursor: window.btoa(newMessage.id),
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
