// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import communityMetaDataFragment from '../../fragments/community/communityMetaData';
import type { CommunityMetaDataType } from '../../fragments/community/communityMetaData';
import communityInfoFragment from '../../fragments/community/communityInfo';
import type { CommunityInfoType } from '../../fragments/community/communityInfo';
import communityMembersFragment, {
  type CommunityMembersType,
} from '../../fragments/community/communityMembers';

export type GetCommunityMembersType = {
  ...$Exact<CommunityInfoType>,
  ...$Exact<CommunityMetaDataType>,
  ...$Exact<CommunityMembersType>,
};

const LoadMoreMembers = gql`
  query loadMoreCommunityMembers(
    $id: ID
    $after: String
    $first: Int
    $filter: MembersFilter
  ) {
    community(id: $id) {
      ...communityInfo
      ...communityMetaData
      ...communityMembers
    }
  }
  ${communityInfoFragment}
  ${communityMetaDataFragment}
  ${communityMembersFragment}
`;

export const getcommunityMembersQuery = gql`
  query getCommunityMembers(
    $id: ID
    $after: String
    $first: Int
    $filter: MembersFilter
  ) {
    community(id: $id) {
      ...communityInfo
      ...communityMetaData
      ...communityMembers
    }
  }
  ${communityInfoFragment}
  ${communityMetaDataFragment}
  ${communityMembersFragment}
`;

const getcommunityMembersOptions = {
  props: ({
    data: { fetchMore, error, loading, community, networkStatus },
    ownProps: { filter },
  }) => ({
    data: {
      error,
      loading,
      community,
      networkStatus: networkStatus,
      hasNextPage:
        community && community.members
          ? community.members.pageInfo.hasNextPage
          : false,
      fetchMore: () =>
        fetchMore({
          query: LoadMoreMembers,
          variables: {
            id: community.id,
            after:
              community.members.edges[community.members.edges.length - 1]
                .cursor,
            filter: filter || null,
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult.community) {
              return prev;
            }

            return {
              ...prev,
              community: {
                ...prev.community,
                members: {
                  ...prev.community.members,
                  pageInfo: {
                    ...prev.community.members.pageInfo,
                    ...fetchMoreResult.community.members.pageInfo,
                  },
                  edges: [
                    ...prev.community.members.edges,
                    ...fetchMoreResult.community.members.edges,
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
    filter,
    after,
    first = 10,
  }: {
    id: string,
    filter: ?Object,
    after?: string,
    first?: number,
  }) => ({
    variables: {
      id,
      after: after || null,
      filter,
      first,
    },
    fetchPolicy: 'cache-and-network',
  }),
};

export default graphql(getcommunityMembersQuery, getcommunityMembersOptions);
