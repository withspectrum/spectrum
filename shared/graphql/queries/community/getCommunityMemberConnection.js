// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import communityMetaDataFragment from '../../fragments/community/communityMetaData';
import type { CommunityMetaDataType } from '../../fragments/community/communityMetaData';
import communityInfoFragment from '../../fragments/community/communityInfo';
import type { CommunityInfoType } from '../../fragments/community/communityInfo';
import communityMemberConnectionFragment from '../../fragments/community/communityMemberConnection';
import type { CommunityMemberConnectionType } from '../../fragments/community/communityMemberConnection';

export type GetCommunityMemberConnectionType = {
  ...$Exact<CommunityInfoType>,
  ...$Exact<CommunityMetaDataType>,
  ...$Exact<CommunityMemberConnectionType>,
};

const LoadMoreMembers = gql`
  query loadMoreCommunityMembers($id: ID, $after: String) {
    community(id: $id) {
      ...communityInfo
      ...communityMetaData
      ...communityMemberConnection
    }
  }
  ${communityInfoFragment}
  ${communityMetaDataFragment}
  ${communityMemberConnectionFragment}
`;

const getCommunityMemberConnectionQuery = gql`
  query getCommunityMembers($id: ID, $after: String) {
    community(id: $id) {
      ...communityInfo
      ...communityMetaData
      ...communityMemberConnection
    }
  }
  ${communityInfoFragment}
  ${communityMetaDataFragment}
  ${communityMemberConnectionFragment}
`;

const getCommunityMemberConnectionOptions = {
  props: ({
    data: { fetchMore, error, loading, community, networkStatus },
  }) => ({
    data: {
      error,
      loading,
      community,
      networkStatus: networkStatus,
      hasNextPage: community
        ? community.memberConnection.pageInfo.hasNextPage
        : false,
      fetchMore: () =>
        fetchMore({
          query: LoadMoreMembers,
          variables: {
            id: community.id,
            after:
              community.memberConnection.edges[
                community.memberConnection.edges.length - 1
              ].cursor,
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult.community) {
              return prev;
            }

            return {
              ...prev,
              community: {
                ...prev.community,
                memberConnection: {
                  ...prev.community.memberConnection,
                  pageInfo: {
                    ...prev.community.memberConnection.pageInfo,
                    ...fetchMoreResult.community.memberConnection.pageInfo,
                  },
                  edges: [
                    ...prev.community.memberConnection.edges,
                    ...fetchMoreResult.community.memberConnection.edges,
                  ],
                },
              },
            };
          },
        }),
    },
  }),
  options: ({ id, after }: { id: string, after?: string }) => ({
    variables: {
      id,
      after: after || null,
    },
    fetchPolicy: 'cache-and-network',
  }),
};

export default graphql(
  getCommunityMemberConnectionQuery,
  getCommunityMemberConnectionOptions
);
