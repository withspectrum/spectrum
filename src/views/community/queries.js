// @flow
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import threadInfoFragment from 'shared/graphql/fragments/thread/threadInfo';
import communityInfoFragment from 'shared/graphql/fragments/community/communityInfo';
import communityThreadConnectionFragment from 'shared/graphql/fragments/community/communityThreadConnection';
import channelInfoFragment from 'shared/graphql/fragments/channel/channelInfo';
import { subscribeToUpdatedThreads } from 'shared/graphql/subscriptions';
import { parseRealtimeThreads } from 'shared/graphql/subscriptions/utils';

const LoadMoreThreads = gql`
  query loadMoreCommunityThreads($slug: String, $after: String, $id: ID) {
    community(slug: $slug, id: $id) {
      ...communityInfo
      ...communityThreadConnection
    }
  }
  ${communityInfoFragment}
  ${communityThreadConnectionFragment}
`;

const threadsQueryOptions = {
  props: ({
    ownProps,
    data: {
      fetchMore,
      error,
      loading,
      community,
      networkStatus,
      subscribeToMore,
    },
  }) => ({
    data: {
      error,
      loading,
      networkStatus,
      community,
      threads: community ? community.threadConnection.edges : [],
      hasNextPage: community
        ? community.threadConnection.pageInfo.hasNextPage
        : false,
      feed: community && community.id,
      subscribeToUpdatedThreads: () => {
        return subscribeToMore({
          document: subscribeToUpdatedThreads,
          updateQuery: (prev, { subscriptionData }) => {
            const updatedThread = subscriptionData.data.threadUpdated;
            if (!updatedThread) return prev;

            const thisCommunityId = ownProps.community.id;
            const updatedThreadShouldAppearInContext =
              thisCommunityId === updatedThread.community.id;

            const newThreads = updatedThreadShouldAppearInContext
              ? parseRealtimeThreads(
                  prev.community.threadConnection.edges,
                  updatedThread,
                  ownProps.dispatch
                ).filter(thread => thread.node.community.id === thisCommunityId)
              : [...prev.community.threadConnection.edges];

            return {
              ...prev,
              community: {
                ...prev.community,
                threadConnection: {
                  ...prev.community.threadConnection,
                  pageInfo: {
                    ...prev.community.threadConnection.pageInfo,
                  },
                  edges: newThreads,
                },
              },
            };
          },
        });
      },
      fetchMore: () =>
        fetchMore({
          query: LoadMoreThreads,
          variables: {
            after:
              community.threadConnection.edges[
                community.threadConnection.edges.length - 1
              ].cursor,
            slug: community.slug,
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
  options: ({ slug, id }) => ({
    variables: {
      slug: slug && slug.toLowerCase(),
      id,
    },
    fetchPolicy: 'cache-and-network',
  }),
};

export const getCommunityThreads = graphql(
  gql`
    query communityThreads($slug: String, $after: String, $id: ID) {
      community(slug: $slug, id: $id) {
        ...communityInfo
        pinnedThread {
          ...threadInfo
        }
        watercooler {
          ...threadInfo
        }
        ...communityThreadConnection
      }
    }
    ${communityThreadConnectionFragment}
    ${communityInfoFragment}
    ${threadInfoFragment}
  `,
  threadsQueryOptions
);

export const GET_COMMUNITY_CHANNELS_QUERY = gql`
  query getCommunityChannels($slug: String) {
    community(slug: $slug) {
      ...communityInfo
      channelConnection {
        edges {
          node {
            ...channelInfo
          }
        }
      }
    }
  }
  ${channelInfoFragment}
  ${communityInfoFragment}
`;

export const GET_COMMUNITY_CHANNELS_OPTIONS = {
  options: ({ communitySlug }: { communitySlug: string }) => ({
    variables: {
      slug: communitySlug.toLowerCase(),
    },
    fetchPolicy: 'cache-and-network',
  }),
};

export const getCommunityChannels = graphql(
  GET_COMMUNITY_CHANNELS_QUERY,
  GET_COMMUNITY_CHANNELS_OPTIONS
);
