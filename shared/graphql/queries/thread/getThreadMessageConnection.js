// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import queryString from 'query-string';
import { btoa } from 'b2a';
import { subscribeToNewMessages } from '../../subscriptions';
import threadInfoFragment from '../../fragments/thread/threadInfo';
import type { ThreadInfoType } from '../../fragments/thread/threadInfo';
import threadMessageConnectionFragment from '../../fragments/thread/threadMessageConnection';
import type { ThreadMessageConnectionType } from '../../fragments/thread/threadMessageConnection';

export type GetThreadMessageConnectionType = {
  ...$Exact<ThreadInfoType>,
  ...$Exact<ThreadMessageConnectionType>,
};

type Variables = {
  id: string,
  last?: number,
  first?: number,
  after?: string,
  before?: string,
};

const getVariables = ({ thread, ...props }): Variables => {
  // if the thread has less than 25 messages, just load all of them
  if (thread && thread.messageCount <= 25) {
    return {
      id: props.id,
      last: 25,
    };
  }

  // If the user is linked to either a specific message or has pagination URL params, load those messages
  if (props.location && props.location.search) {
    const params = queryString.parse(props.location.search);

    if (params) {
      if (params.msgsafter) {
        return {
          id: props.id,
          after: params.msgsafter,
          first: 25,
        };
      } else if (params.msgsbefore) {
        return {
          id: props.id,
          before: params.msgsbefore,
          last: 25,
        };
      } else if (params.m) {
        return {
          id: props.id,
          after: params.m,
          first: 25,
        };
      }
    }
  }

  // if it's a watercooler thread load the 25 most recent messages
  if (props.isWatercooler) {
    return {
      id: props.id,
      last: 25,
    };
  }

  // If a user has seen a thread, load the last 25
  if (thread.currentUserLastSeen) {
    return {
      id: props.id,
      last: 25,
    };
  }

  // In all other cases, load the first 25
  return {
    id: props.id,
    first: 25,
  };
};

export const getThreadMessageConnectionQuery = gql`
  query getThreadMessages(
    $id: ID!
    $after: String
    $first: Int
    $before: String
    $last: Int
  ) {
    thread(id: $id) {
      ...threadInfo
      ...threadMessageConnection
    }
  }
  ${threadInfoFragment}
  ${threadMessageConnectionFragment}
`;
export const getThreadMessageConnectionOptions = {
  // $FlowFixMe
  options: props => {
    return {
      variables: getVariables(props),
      fetchPolicy: 'cache-and-network',
    };
  },
  // $FlowFixMe
  props: props => ({
    data: {
      ...props.data,
      messageConnection: props.data.thread
        ? props.data.thread.messageConnection
        : null,
    },
    loadNextPage: () => {
      let cursor;
      const { thread } = props.data;
      if (
        thread &&
        thread.messageConnection &&
        thread.messageConnection.edges &&
        thread.messageConnection.edges.length > 0
      ) {
        cursor =
          thread.messageConnection.edges[
            thread.messageConnection.edges.length - 1
          ].cursor;
      }
      return props.data.fetchMore({
        variables: {
          after: cursor,
          first: 25,
          before: undefined,
          last: undefined,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult || !fetchMoreResult.thread) return prev;

          return {
            ...prev,
            thread: {
              ...prev.thread,
              messageConnection: {
                ...prev.thread.messageConnection,
                pageInfo: {
                  ...prev.thread.messageConnection.pageInfo,
                  hasNextPage:
                    fetchMoreResult.thread.messageConnection.pageInfo
                      .hasNextPage,
                },
                edges: [
                  ...prev.thread.messageConnection.edges,
                  ...fetchMoreResult.thread.messageConnection.edges,
                ],
              },
            },
          };
        },
      });
    },
    loadPreviousPage: () => {
      let cursor;
      const { thread } = props.data;
      if (
        thread &&
        thread.messageConnection &&
        thread.messageConnection.edges &&
        thread.messageConnection.edges.length > 0
      ) {
        cursor = thread.messageConnection.edges[0].cursor;
      }
      return props.data.fetchMore({
        variables: {
          after: undefined,
          first: undefined,
          before: cursor,
          last: 25,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult || !fetchMoreResult.thread) return prev;
          const {
            messageConnection: { pageInfo, edges },
          } = fetchMoreResult.thread;

          return {
            ...prev,
            thread: {
              ...prev.thread,
              messageConnection: {
                ...prev.thread.messageConnection,
                pageInfo: {
                  ...prev.thread.messageConnection.pageInfo,
                  hasPreviousPage: pageInfo.hasPreviousPage,
                },
                edges: edges
                  ? [...edges, ...prev.thread.messageConnection.edges]
                  : prev.thread.messageConnection.edges,
              },
            },
          };
        },
      });
    },
    subscribeToNewMessages: () => {
      return props.data.subscribeToMore({
        document: subscribeToNewMessages,
        variables: {
          thread: props.ownProps.id,
        },
        updateQuery: (prev, { subscriptionData }) => {
          const newMessage = subscriptionData.data.messageAdded;
          const existingMessage = prev.thread.messageConnection.edges.find(
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
                ...prev.thread,
                messageConnection: {
                  ...prev.thread.messageConnection,
                  edges: prev.thread.messageConnection.edges.map(edge => {
                    // Replace the optimstic update with the actual db message
                    if (edge.node.id === existingMessage.id)
                      return {
                        ...edge,
                        cursor: btoa(newMessage.id),
                        node: newMessage,
                      };

                    return edge;
                  }),
                },
              },
            };
            // If the message is already in the state because the mutation already
            // added it, ignore it and don't duplicate it
          } else if (existingMessage) {
            return prev;
          }

          // Add the new message to the data
          return {
            ...prev,
            thread: {
              ...prev.thread,
              messageConnection: {
                ...prev.thread.messageConnection,
                edges: [
                  ...prev.thread.messageConnection.edges,
                  // NOTE(@mxstbr): The __typename hack is to work around react-apollo/issues/658
                  {
                    node: newMessage,
                    cursor: btoa(newMessage.id),
                    __typename: 'ThreadMessageEdge',
                  },
                ],
              },
            },
          };
        },
      });
    },
  }),
};

export default graphql(
  getThreadMessageConnectionQuery,
  getThreadMessageConnectionOptions
);
