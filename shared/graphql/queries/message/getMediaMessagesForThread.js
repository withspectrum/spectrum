// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

type Message = {
  id: string,
  content: {
    body: string,
  },
};

export type GetMediaMessagesForThreadType = Array<?Message>;

const getMediaMessagesForThreadQuery = gql`
  query getMediaMessagesForThread($threadId: String) {
    getMediaMessagesForThread(threadId: $threadId) {
      id
      content {
        body
      }
    }
  }
`;

const getMediaMessagesForThreadOptions = {
  options: ({ threadId }) => ({
    variables: {
      threadId,
    },
    fetchPolicy: 'network-only',
  }),
  props: ({ data: { error, loading, getMediaMessagesForThread } }) => ({
    data: {
      error,
      loading,
      getMediaMessagesForThread,
      messages: getMediaMessagesForThread ? getMediaMessagesForThread : '',
    },
  }),
};

export default graphql(
  getMediaMessagesForThreadQuery,
  getMediaMessagesForThreadOptions
);
