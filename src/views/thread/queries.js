import gql from 'graphql-tag';

import { graphql } from 'react-apollo';
import queryString from 'query-string';
import { subscribeToNewMessages } from '../../api/subscriptions';
import { threadInfoFragment } from '../../api/fragments/thread/threadInfo';
import { threadMessagesFragment } from '../../api/fragments/thread/threadMessages';

export const GET_THREAD_QUERY = gql`
  query getThread($id: ID!) {
    thread(id: $id) {
      ...threadInfo
    }
  }
  ${threadInfoFragment}
`;
export const GET_THREAD_OPTIONS = {
  options: props => ({
    variables: {
      id: props.threadId || props.match.params.threadId,
    },
    fetchPolicy: 'cache-first',
  }),
};
export const getThread = graphql(GET_THREAD_QUERY, GET_THREAD_OPTIONS);

export const GET_THREAD_MESSAGES_QUERY = gql`
  query getThreadMessages(
    $id: ID!
    $after: String
    $first: Int
    $before: String
    $last: Int
  ) {
    thread(id: $id) {
      id
      content {
        title
      }
      currentUserLastSeen
      ...threadMessages
    }
  }
  ${threadMessagesFragment}
`;
export const GET_THREAD_MESSAGES_OPTIONS = {
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
          variables.last = 50;
        }
      }
    }

    return {
      variables,
      fetchPolicy: 'cache-and-network',
    };
  },
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

export const getThreadMessages = graphql(
  GET_THREAD_MESSAGES_QUERY,
  GET_THREAD_MESSAGES_OPTIONS
);
