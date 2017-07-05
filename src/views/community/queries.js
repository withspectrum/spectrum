// @flow
// $FlowFixMe
import { graphql, gql } from 'react-apollo';
// $FlowFixMe
import update from 'immutability-helper';
import { encode } from '../../helpers/utils';
import { userInfoFragment } from '../../api/fragments/user/userInfo';
import {
  communityInfoFragment,
} from '../../api/fragments/community/communityInfo';
import {
  communityThreadsFragment,
} from '../../api/fragments/community/communityThreads';
import { channelInfoFragment } from '../../api/fragments/channel/channelInfo';
import {
  channelMetaDataFragment,
} from '../../api/fragments/channel/channelMetaData';

const LoadMoreThreads = gql`
  query communityThreads($slug: String, $after: String) {
    community(slug: $slug) {
      ...communityInfo
      ...communityThreads
    }
  }
  ${communityInfoFragment}
  ${communityThreadsFragment}
`;

const threadsQueryOptions = {
  props: ({
    data: { fetchMore, error, loading, community, networkStatus },
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
      fetchMore: () =>
        fetchMore({
          query: LoadMoreThreads,
          variables: {
            after: community.threadConnection.edges[
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
  options: ({ slug, params }) => ({
    variables: {
      slug: slug.toLowerCase(),
    },
    reducer: (prev, action, variables) => {
      /*
        Every apollo action triggers internal store updates via reducers.
        We can abuse this to listen for specific kinds of actions that happen
        anywhere in the app in order to update any query.

        Reference: http://dev.apollodata.com/react/cache-updates.html#resultReducers
      */
      if (
        action.type === 'APOLLO_MUTATION_RESULT' &&
        action.operationName === 'publishThread'
      ) {
        /*
          publishThread returns a thread object, as well as some metadata about
          the channel and community it was published in
        */
        const newThread = action.result.data.publishThread;

        /*
          If the new thread was published in a community that is currently
          being viewed, or in a community that has already been fetched
          and cached by apollo, insert the new thread into the array of edges
        */
        if (newThread.channel.community.slug === slug) {
          /*
            Not sure if this is needed right now, but I'm encoding the thread id
            and setting a new cursor so that we can always be sure that every
            item in the Apollo store has the same shape
          */
          const cursor = encode(newThread.id);
          const newEdge = {
            cursor,
            node: {
              ...newThread,
            },
          };

          /*
            Uses immutability helpers to set the previous state and then overlay
            only the modified data
            $unshift moves the new edge to the top of the threads array

            Reference: https://facebook.github.io/react/docs/update.html
          */
          return update(prev, {
            community: {
              threadConnection: {
                edges: {
                  $unshift: [newEdge],
                },
              },
            },
          });
        }
      }

      /* More action reducers go here */

      /*
        If no actions trigger a change in this queries store, return the existing
        store
      */
      return prev;
    },
  }),
};

export const getCommunityThreads = graphql(
  gql`
		query communityThreads($slug: String, $after: String) {
			community(slug: $slug) {
        ...communityInfo
        ...communityThreads
      }
		}
    ${communityThreadsFragment}
    ${communityInfoFragment}
	`,
  threadsQueryOptions
);

/*
  Loads the sidebar profile component widget independent of the thread feed.
  In the future we can compose these queries together since they are fetching
  such similar data, but for now we're making a decision to keep the data
  queries specific to each component.
*/
const profileQueryOptions = {
  options: ({ match: { params: { communitySlug } } }) => ({
    variables: {
      slug: communitySlug.toLowerCase(),
    },
    fetchPolicy: 'cache-and-network',
  }),
};

export const getCommunity = graphql(
  gql`
		query getCommunity($slug: String) {
			community(slug: $slug) {
        ...communityInfo
      }
		}
    ${communityInfoFragment}
	`,
  profileQueryOptions
);

export const GET_COMMUNITY_CHANNELS_QUERY = gql`
  query getCommunityChannels($slug: String) {
    community(slug: $slug) {
      ...communityInfo
      channelConnection {
        edges {
          node {
            ...channelInfo
            ...channelMetaData
            pendingUsers {
              ...userInfo
            }
          }
        }
      }
    }
  }
  ${userInfoFragment}
  ${channelInfoFragment}
  ${communityInfoFragment}
  ${channelMetaDataFragment}
`;

export const getCommunityChannels = graphql(GET_COMMUNITY_CHANNELS_QUERY);
