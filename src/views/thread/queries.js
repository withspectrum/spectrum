import { graphql, gql } from 'react-apollo';
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
  query getThreadMessages($id: ID!, $after: String) {
    thread(id: $id) {
      id
      content {
        title
      }
      ...threadMessages
    }
  }
  ${threadMessagesFragment}
`;
export const GET_THREAD_MESSAGES_OPTIONS = {
  options: props => ({
    variables: { id: props.id },
    fetchPolicy: 'cache-and-network',
  }),
  props: props => ({
    data: props.data,
    subscribeToNewMessages: () => {
      return props.data.subscribeToMore({
        document: subscribeToNewMessages,
        variables: {
          thread: props.ownProps.id,
        },
        updateQuery: (prev, { subscriptionData }) => {
          const newMessage = subscriptionData.data.messageAdded;
          // Add the new message to the data
          return Object.assign({}, prev, {
            ...prev,
            thread: {
              ...prev.thread,
              messageConnection: {
                ...prev.thread.messageConnection,
                edges: [
                  ...prev.thread.messageConnection.edges,
                  // NOTE(@mxstbr): The __typename hack is to work around react-apollo/issues/658
                  { node: newMessage, __typename: 'ThreadMessageEdge' },
                ],
              },
            },
          });
        },
      });
    },
  }),
};

export const getThreadMessages = graphql(
  GET_THREAD_MESSAGES_QUERY,
  GET_THREAD_MESSAGES_OPTIONS
);
