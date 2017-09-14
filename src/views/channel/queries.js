// @flow
// $FlowFixMe
import { graphql, gql } from 'react-apollo';
// $FlowFixMe
import update from 'immutability-helper';
import { encode } from '../../helpers/utils';
import { channelInfoFragment } from '../../api/fragments/channel/channelInfo';
import { channelThreadsFragment } from '../../api/fragments/channel/channelThreads';
import { channelMetaDataFragment } from '../../api/fragments/channel/channelMetaData';
import { subscribeToUpdatedThreads } from '../../api/subscriptions';

const LoadMoreThreads = gql`
  query loadMoreChannelThreads($id: ID, $after: String) {
    channel(id: $id) {
      ...channelInfo
      ...channelThreads
    }
  }
  ${channelInfoFragment}
  ${channelThreadsFragment}
`;

const threadsQueryOptions = {
  props: ({
    data: {
      fetchMore,
      error,
      loading,
      channel,
      networkStatus,
      subscribeToMore,
    },
  }) => ({
    data: {
      error,
      loading,
      networkStatus,
      channel,
      threads: channel ? channel.threadConnection.edges : '',
      hasNextPage: channel
        ? channel.threadConnection.pageInfo.hasNextPage
        : false,
      subscribeToUpdatedThreads: () => {
        return subscribeToMore({
          document: subscribeToUpdatedThreads,
          updateQuery: (prev, { subscriptionData }) => {
            const updatedThread = subscriptionData.data.threadUpdated;
            if (!updatedThread) return prev;

            return {
              ...prev,
              channel: {
                ...prev.channel,
                threadConnection: {
                  ...prev.channel.threadConnection,
                  pageInfo: {
                    ...prev.channel.threadConnection.pageInfo,
                  },
                  edges: [
                    ...prev.channel.threadConnection.edges.map(thread => {
                      if (thread.channelId !== prev.channel.id) return;
                      if (thread.node.id !== updatedThread.id) return thread;
                      return {
                        node: updatedThread,
                        cursor: '__this-is-a-cursor__',
                        __typename: 'Thread',
                      };
                    }),
                  ],
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
              channel.threadConnection.edges[
                channel.threadConnection.edges.length - 1
              ].cursor,
            id: channel.id,
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult.channel) {
              return prev;
            }
            return {
              ...prev,
              channel: {
                ...prev.channel,
                threadConnection: {
                  ...prev.channel.threadConnection,
                  pageInfo: {
                    ...prev.channel.threadConnection.pageInfo,
                    ...fetchMoreResult.channel.threadConnection.pageInfo,
                  },
                  edges: [
                    ...prev.channel.threadConnection.edges,
                    ...fetchMoreResult.channel.threadConnection.edges,
                  ],
                },
              },
            };
          },
        }),
    },
  }),
  options: ({ channelSlug, communitySlug }) => ({
    variables: {
      channelSlug: channelSlug.toLowerCase(),
      communitySlug: communitySlug.toLowerCase(),
    },
    fetchPolicy: 'cache-and-network',
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
          If the new thread was published in a channel that is currently
          being viewed, or in a channel that has already been fetched
          and cached by apollo, insert the new thread into the array of edges
        */
        if (newThread.channel.slug === channelSlug) {
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
            channel: {
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

export const getChannelThreads = graphql(
  gql`
    query getChannelThreads($channelSlug: String, $communitySlug: String, $after: String) {
			channel(channelSlug: $channelSlug, communitySlug: $communitySlug) {
        ...channelInfo
        ...channelThreads
      }
    }
    ${channelInfoFragment}
    ${channelThreadsFragment}
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
  options: ({ match: { params: { channelSlug, communitySlug } } }) => ({
    variables: {
      channelSlug: channelSlug.toLowerCase(),
      communitySlug: communitySlug.toLowerCase(),
    },
    fetchPolicy: 'cache-first',
  }),
};

export const getChannel = graphql(
  gql`
		query getChannel($channelSlug: String, $communitySlug: String) {
			channel(channelSlug: $channelSlug, communitySlug: $communitySlug) {
        ...channelInfo
        ...channelMetaData
      }
		}
    ${channelInfoFragment}
    ${channelMetaDataFragment}
	`,
  profileQueryOptions
);
