// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { btoa } from 'b2a';
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
  }),
};

export default graphql(
  getDMThreadMessageConnectionQuery,
  getDMThreadMessageConnectionOptions
);
