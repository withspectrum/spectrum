// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import queryString from 'query-string';
import { subscribeToNewMessages } from '../../subscriptions';
import threadInfoFragment from '../../fragments/thread/threadInfo';
import type { ThreadInfoType } from '../../fragments/thread/threadInfo';
import threadMessageConnectionFragment from '../../fragments/thread/threadMessageConnection';
import type { ThreadMessageConnectionType } from '../../fragments/thread/threadMessageConnection';

export type GetThreadMessageConnectionType = {
  ...$Exact<ThreadInfoType>,
  ...$Exact<ThreadMessageConnectionType>,
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
    let msgsafter, msgsbefore;
    if (props.location && props.location.search) {
      try {
        const params = queryString.parse(props.location.search);
        msgsafter = params.msgsafter;
        msgsbefore = params.msgsbefore;
      } catch (err) {
        // Ignore errors in query string parsing, who cares
        console.log(err);
      }
    }
    let variables = {
      id: props.id,
      after: msgsafter ? msgsafter : null,
      before: msgsbefore && !msgsafter ? msgsbefore : null,
      last: null,
      first: null,
    };

    // Any thread with less than 50 messages just load all of 'em
    if (props.threadMessageCount >= 50) {
      // If the thread was active after the user last saw it, only load the new messages
      if (props.lastSeen) {
        if (
          new Date(props.lastSeen).getTime() <
          new Date(props.lastActive).getTime()
        ) {
          variables.after = window.btoa(new Date(props.lastSeen).getTime());
          // Otherwise load the last 50 messages
        } else {
          // $FlowFixMe
          variables.last = 50;
        }
      }
    }

    return {
      variables,
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
          first: undefined,
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
          last: undefined,
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
                        cursor: window.btoa(newMessage.id),
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
                    cursor: window.btoa(newMessage.id),
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
