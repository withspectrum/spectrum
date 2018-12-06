// @flow
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import userInfoFragment from '../../fragments/user/userInfo';
import type { UserInfoType } from '../../fragments/user/userInfo';
import userCommunityConnectionFragment from '../../fragments/user/userCommunityConnection';
import type { UserCommunityConnectionType } from '../../fragments/user/userCommunityConnection';

export type GetUserCommunityConnectionType = {
  ...$Exact<UserInfoType>,
  totalReputation: number,
  ...$Exact<UserCommunityConnectionType>,
};

const LoadMoreCommunities = gql`
  query loadMoreUserCommunities($after: String, $id: ID) {
    user(id: $id) {
      ...userInfo
      ...userCommunityConnection
    }
  }
  ${userInfoFragment}
  ${userCommunityConnectionFragment}
`;

export const getUserCommunityConnectionQuery = gql`
  query getUserCommunityConnection($id: ID, $after: String) {
    user(id: $id) {
      ...userInfo
      ...userCommunityConnection
    }
  }
  ${userInfoFragment}
  ${userCommunityConnectionFragment}
`;

export const getCurrentUserCommunityConnectionQuery = gql`
  query getCurrentUserCommunityConnection {
    user: currentUser {
      ...userInfo
      ...userCommunityConnection
    }
  }
  ${userInfoFragment}
  ${userCommunityConnectionFragment}
`;

const getUserCommunityConnectionOptions = {
  props: ({ ownProps, data }) => ({
    data: {
      ...data,
      hasNextPage:
        data.user && data.user.communityConnection
          ? data.user.communityConnection.pageInfo.hasNextPage
          : false,
      fetchMore: () =>
        data.fetchMore({
          query: LoadMoreCommunities,
          variables: {
            after:
              data.user.communityConnection.edges[
                data.user.communityConnection.edges.length - 1
              ].cursor,
            id: data.user.id,
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult.user) {
              return prev;
            }
            return {
              ...prev,
              user: {
                ...prev.user,
                communityConnection: {
                  ...prev.user.communityConnection,
                  pageInfo: {
                    ...prev.user.communityConnection.pageInfo,
                    ...fetchMoreResult.user.communityConnection.pageInfo,
                  },
                  edges: [
                    ...prev.user.communityConnection.edges,
                    ...fetchMoreResult.user.communityConnection.edges,
                  ],
                },
              },
            };
          },
        }),
    },
  }),
  options: ({ id }) => ({
    variables: {
      id,
      first: 5,
    },
    fetchPolicy: 'cache-and-network',
  }),
};

export const getCurrentUserCommunityConnection = graphql(
  getCurrentUserCommunityConnectionQuery,
  { options: { fetchPolicy: 'cache-and-network' } }
);

export const getUserCommunityConnection = graphql(
  getUserCommunityConnectionQuery,
  getUserCommunityConnectionOptions
);
