// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import queryString from 'query-string';
import { subscribeToNewMessages } from 'shared/graphql/subscriptions';
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
    data: props.data,
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
          console.log('subscriptionData', subscriptionData);
          const newMessage = subscriptionData.data.messageAdded;
          const existingMessage = prev.thread.messageConnection.edges.find(
            ({ node }) => node.id === newMessage.id
          );
          // If the message is already in the state because the mutation already
          // added it, replace it rather than appending it twice
          if (existingMessage) return prev;

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
