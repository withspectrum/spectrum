// @flow
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import threadInfoFragment from '../../fragments/thread/threadInfo';
import communityInfoFragment from '../../fragments/community/communityInfo';
import type { CommunityInfoType } from '../../fragments/community/communityInfo';
import communityThreadConnectionFragment from '../../fragments/community/communityThreadConnection';
import type { CommunityThreadConnectionType } from '../../fragments/community/communityThreadConnection';

export type GetCommunityThreadConnectionType = {
  ...$Exact<CommunityInfoType>,
  ...$Exact<CommunityThreadConnectionType>,
};

const LoadMoreThreads = gql`
  query loadMoreCommunityThreads(
    $after: String
    $id: ID
    $sort: CommunityThreadConnectionSort
  ) {
    community(id: $id) {
      ...communityInfo
      ...communityThreadConnection
    }
  }
  ${threadInfoFragment}
  ${communityInfoFragment}
  ${communityThreadConnectionFragment}
`;

export const getCommunityThreadConnectionQuery = gql`
  query getCommunityThreadConnection(
    $id: ID
    $after: String
    $sort: CommunityThreadConnectionSort
  ) {
    community(id: $id) {
      ...communityInfo
      ...communityThreadConnection
    }
  }
  ${threadInfoFragment}
  ${communityInfoFragment}
  ${communityThreadConnectionFragment}
`;

const getCommunityThreadConnectionOptions = {
  props: ({
    ownProps,
    data: { fetchMore, error, loading, community, networkStatus, refetch },
  }) => ({
    data: {
      error,
      loading,
      networkStatus,
      community,
      refetch,
      threadConnection: community && community.threadConnection,
      threads:
        community && community.threadConnection
          ? community.threadConnection.edges
          : [],
      hasNextPage:
        community && community.threadConnection
          ? community.threadConnection.pageInfo.hasNextPage
          : false,
      feed: community && community.id,
      fetchMore: () =>
        fetchMore({
          query: LoadMoreThreads,
          variables: {
            after:
              community.threadConnection.edges[
                community.threadConnection.edges.length - 1
              ].cursor,
            id: community.id,
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult.community) {
              return prev;
            }
            return {
              ...prev,
              community: {
                ...prev.community,
                threadConnection: {
                  ...prev.community.threadConnection,
                  pageInfo: {
                    ...prev.community.threadConnection.pageInfo,
                    ...fetchMoreResult.community.threadConnection.pageInfo,
                  },
                  edges: [
                    ...prev.community.threadConnection.edges,
                    ...fetchMoreResult.community.threadConnection.edges,
                  ],
                },
              },
            };
          },
        }),
    },
  }),
  options: ({
    id,
    after,
    sort,
  }: {
    id: string,
    after?: ?string,
    sort?: ?string,
  }) => ({
    variables: {
      id,
      after: after || null,
      sort,
    },
    fetchPolicy: 'cache-and-network',
  }),
};

export default graphql(
  getCommunityThreadConnectionQuery,
  getCommunityThreadConnectionOptions
);
