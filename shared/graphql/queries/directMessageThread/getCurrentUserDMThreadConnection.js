// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import userDirectMessageThreadsConnectionFragment from '../../fragments/user/userDirectMessageThreadConnection';
import type { UserDirectMessageThreadsConnectionType } from '../../fragments/user/userDirectMessageThreadConnection';
import userInfoFragment from '../../fragments/user/userInfo';
import type { UserInfoType } from '../../fragments/user/userInfo';

export type GetCurrentUserDMThreadConnectionType = {
  ...$Exact<UserInfoType>,
  ...$Exact<UserDirectMessageThreadsConnectionType>,
};

const LoadMoreDirectMessageThreads = gql`
  query loadMoreDirectMessageThreads($after: String) {
    user: currentUser {
      ...userInfo
      ...userDirectMessageThreadConnection
    }
  }
  ${userInfoFragment}
  ${userDirectMessageThreadsConnectionFragment}
`;

export const getCurrentUserDMThreadConnectionQuery = gql`
  query currentUserDirectMessageThreads($after: String) {
    user: currentUser {
      ...userInfo
      ...userDirectMessageThreadConnection
    }
  }
  ${userInfoFragment}
  ${userDirectMessageThreadsConnectionFragment}
`;

export const getCurrentUserDMThreadConnectionOptions = {
  options: {
    variables: {
      after: '',
    },
    fetchPolicy: 'cache-and-network',
  },
  // $FlowFixMe
  props: props => ({
    ...props,
    dmData: {
      ...props.data,
      fetchMore: () =>
        props.data.fetchMore({
          query: LoadMoreDirectMessageThreads,
          variables: {
            after:
              props.data.user.directMessageThreadsConnection.edges[
                props.data.user.directMessageThreadsConnection.edges.length - 1
              ].cursor,
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult.user) {
              return prev;
            }

            const foo = {
              ...prev,
              user: {
                ...prev.user,
                directMessageThreadsConnection: {
                  ...prev.user.directMessageThreadsConnection,
                  pageInfo: {
                    ...prev.user.directMessageThreadsConnection.pageInfo,
                    ...fetchMoreResult.user.directMessageThreadsConnection
                      .pageInfo,
                  },
                  edges: [
                    ...prev.user.directMessageThreadsConnection.edges,
                    ...fetchMoreResult.user.directMessageThreadsConnection
                      .edges,
                  ],
                },
              },
            };
            return foo;
          },
        }),
    },
  }),
};

export default graphql(
  getCurrentUserDMThreadConnectionQuery,
  getCurrentUserDMThreadConnectionOptions
);
