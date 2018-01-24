// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { getThreadMessageConnectionQuery } from '../../queries/thread/getThreadMessageConnection';
import { getDirectMessageThreadQuery } from '../../queries/directMessageThread/getDirectMessageThread';

export type DeleteMessageType = boolean;

export const deleteMessageMutation = gql`
  mutation deleteMessage($id: ID!) {
    deleteMessage(id: $id)
  }
`;

const deleteMessageOptions = {
  props: ({ ownProps, mutate }) => ({
    ...ownProps,
    deleteMessage: id =>
      mutate({
        variables: {
          id,
        },
        update: store => {
          // we have to split out the optimistic update by thread type
          // because DMs and story threads have different queries and response
          // shapes
          if (ownProps.threadType === 'story') {
            // Read the data from our cache for this query.
            const data = store.readQuery({
              query: getThreadMessageConnectionQuery,
              variables: {
                id: ownProps.threadId,
              },
            });

            data.thread.messageConnection.edges = data.thread.messageConnection.edges.filter(
              ({ node }) => node.id !== id
            );

            // Write our data back to the cache.
            store.writeQuery({
              query: getThreadMessageConnectionQuery,
              data,
              variables: {
                id: ownProps.threadId,
              },
            });
          } else if (ownProps.threadType === 'directMessageThread') {
            // Read the data from our cache for this query.
            const data = store.readQuery({
              query: getDirectMessageThreadQuery,
              variables: {
                id: ownProps.threadId,
              },
            });

            data.directMessageThread.messageConnection.edges = data.directMessageThread.messageConnection.edges.filter(
              message => message.id !== id
            );
            // Write our data back to the cache.
            store.writeQuery({
              query: getDirectMessageThreadQuery,
              data,
              variables: {
                id: ownProps.threadId,
              },
            });
          }
        },
      }),
  }),
};

export default graphql(deleteMessageMutation, deleteMessageOptions);
