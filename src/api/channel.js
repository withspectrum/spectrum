// @flow
// $FlowFixMe
import { graphql, gql } from 'react-apollo';
import { channelInfoFragment } from './fragments/channel/channelInfo';
import { userInfoFragment } from './fragments/user/userInfo';
import { communityInfoFragment } from './fragments/community/communityInfo';
import { channelMetaDataFragment } from './fragments/channel/channelMetaData';

/*
  Create a new channel
*/
const CREATE_CHANNEL_MUTATION = gql`
  mutation createChannel($input: CreateChannelInput!) {
    createChannel (input: $input) {
      ...channelInfo
    }
  }
  ${channelInfoFragment}
`;

const CREATE_CHANNEL_OPTIONS = {
  props: ({ input, mutate }) => ({
    createChannel: input =>
      mutate({
        variables: {
          input,
        },
      }),
  }),
};

export const createChannelMutation = graphql(
  CREATE_CHANNEL_MUTATION,
  CREATE_CHANNEL_OPTIONS
);

/*
  Delete a channel
*/
const DELETE_CHANNEL_MUTATION = gql`
  mutation deleteChannel($channelId: ID!) {
    deleteChannel(channelId: $channelId)
  }
`;

const DELETE_CHANNEL_OPTIONS = {
  props: ({ channelId, mutate }) => ({
    deleteChannel: channelId =>
      mutate({
        variables: {
          channelId,
        },
      }),
  }),
};

export const deleteChannelMutation = graphql(
  DELETE_CHANNEL_MUTATION,
  DELETE_CHANNEL_OPTIONS
);

/*
  Edit a new community
*/
const EDIT_CHANNEL_MUTATION = gql`
  mutation editChannel($input: EditChannelInput!) {
    editChannel (input: $input) {
      ...channelInfo
    }
  }
  ${channelInfoFragment}
`;

const EDIT_CHANNEL_OPTIONS = {
  props: ({ input, mutate }) => ({
    editChannel: input =>
      mutate({
        variables: {
          input,
        },
      }),
  }),
};

export const editChannelMutation = graphql(
  EDIT_CHANNEL_MUTATION,
  EDIT_CHANNEL_OPTIONS
);

/*
  Join or leave a channel
*/
const TOGGLE_CHANNEL_SUBSCRIPTION_MUTATION = gql`
  mutation toggleChannelSubscription($channelId: ID!) {
    toggleChannelSubscription (channelId: $channelId) {
      ...channelInfo
    }
  }
  ${channelInfoFragment}
`;

const TOGGLE_CHANNEL_SUBSCRIPTION_OPTIONS = {
  options: {
    refetchQueries: ['getCurrentUserProfile', 'getEverythingThreads'],
  },
  props: ({ channelId, mutate }) => ({
    toggleChannelSubscription: ({ channelId }) =>
      mutate({
        variables: {
          channelId,
        },
      }),
  }),
};

export const toggleChannelSubscriptionMutation = graphql(
  TOGGLE_CHANNEL_SUBSCRIPTION_MUTATION,
  TOGGLE_CHANNEL_SUBSCRIPTION_OPTIONS
);

/*
  Approve or block a user in a private channel
*/
const TOGGLE_PENDING_USER_MUTATION = gql`
  mutation togglePendingUser($input: TogglePendingUserInput!) {
    togglePendingUser(input: $input) {
      ...channelInfo
      pendingUsers {
        ...userInfo
      }
      blockedUsers {
        ...userInfo
      }
      ...channelMetaData
      community {
        ...communityInfo
      }
    }
  }
  ${channelInfoFragment}
  ${userInfoFragment}
  ${communityInfoFragment}
  ${channelMetaDataFragment}
`;

const TOGGLE_PENDING_USER_OPTIONS = {
  props: ({ input, mutate }) => ({
    togglePendingUser: input =>
      mutate({
        variables: {
          input,
        },
      }),
  }),
};

export const togglePendingUserInChannelMutation = graphql(
  TOGGLE_PENDING_USER_MUTATION,
  TOGGLE_PENDING_USER_OPTIONS
);

/*
  Join or leave a channel
*/
const UNBLOCK_USER_MUTATION = gql`
  mutation unblockUser($input: UnblockUserInput!) {
    unblockUser(input: $input) {
      ...channelInfo
      pendingUsers {
        ...userInfo
      }
      blockedUsers {
        ...userInfo
      }
      ...channelMetaData
      community {
        ...communityInfo
      }
    }
  }
  ${channelInfoFragment}
  ${userInfoFragment}
  ${communityInfoFragment}
  ${channelMetaDataFragment}
`;

const UNBLOCK_USER_OPTIONS = {
  props: ({ input, mutate }) => ({
    unblockUser: input =>
      mutate({
        variables: {
          input,
        },
      }),
  }),
};

export const unblockUserInChannelMutation = graphql(
  UNBLOCK_USER_MUTATION,
  UNBLOCK_USER_OPTIONS
);

export const CHECK_UNIQUE_CHANNEL_SLUG_QUERY = gql`
  query getChannel($channelSlug: String, $communitySlug: String) {
    channel(channelSlug: $channelSlug, communitySlug: $communitySlug) {
      ...channelInfo
    }
  }
  ${channelInfoFragment}
`;

const getChannelByIdOptions = {
  options: ({ id }) => ({
    variables: {
      id,
    },
  }),
};

export const getChannelById = graphql(
  gql`
		query getChannel($id: ID) {
			channel(id: $id) {
        ...channelInfo
      }
		}
    ${channelInfoFragment}
	`,
  getChannelByIdOptions
);

/*
  Gets pending users in a channel
*/
const getPendingUsersOptions = {
  options: ({ id }) => ({
    variables: {
      id,
    },
    fetchPolicy: 'cache-and-network',
  }),
};

export const getPendingUsersQuery = graphql(
  gql`
		query getChannel($id: ID) {
			channel(id: $id) {
        ...channelInfo
        pendingUsers {
          ...userInfo
        }
      }
		}
    ${userInfoFragment}
    ${channelInfoFragment}
	`,
  getPendingUsersOptions
);

/*
  Gets pending users in a channel
*/
const getBlockedUsersOptions = {
  options: ({ id }) => ({
    variables: {
      id,
    },
    fetchPolicy: 'cache-and-network',
  }),
};

export const getBlockedUsersQuery = graphql(
  gql`
		query getChannel($id: ID) {
			channel(id: $id) {
        ...channelInfo
        blockedUsers {
          ...userInfo
        }
      }
		}
    ${userInfoFragment}
    ${channelInfoFragment}
	`,
  getBlockedUsersOptions
);

/*
  Toggle notifications on or off for channel threads
*/
const TOGGLE_CHANNEL_NOTIFICATIONS_MUTATION = gql`
  mutation toggleChannelNotifications($channelId: ID!) {
    toggleChannelNotifications(channelId: $channelId) {
      ...channelInfo
    }
  }
  ${channelInfoFragment}
`;

const TOGGLE_CHANNEL_NOTIFICATIONS_OPTIONS = {
  props: ({ input, mutate }) => ({
    toggleChannelNotifications: channelId =>
      mutate({
        variables: {
          channelId,
        },
      }),
  }),
};

export const toggleChannelNotificationsMutation = graphql(
  TOGGLE_CHANNEL_NOTIFICATIONS_MUTATION,
  TOGGLE_CHANNEL_NOTIFICATIONS_OPTIONS
);

const LoadMoreMembers = gql`
  query loadMoreChannelMembers($id: ID, $after: String) {
    channel(id: $id) {
      id
      ...channelMetaData
      memberConnection(after: $after) {
        pageInfo {
          hasNextPage
          hasPreviousPage
        }
        edges {
          cursor
          node {
            ...userInfo
          }
        }
      }
    }
  }
  ${userInfoFragment}
  ${channelMetaDataFragment}
`;

const getChannelMembersOptions = {
  props: ({ data: { fetchMore, error, loading, channel, networkStatus } }) => ({
    data: {
      error,
      loading,
      channel,
      networkStatus: networkStatus,
      hasNextPage: channel
        ? channel.memberConnection.pageInfo.hasNextPage
        : false,
      fetchMore: () =>
        fetchMore({
          query: LoadMoreMembers,
          variables: {
            id: channel.id,
            after:
              channel.memberConnection.edges[
                channel.memberConnection.edges.length - 1
              ].cursor,
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult.channel) {
              return prev;
            }

            return {
              ...prev,
              channel: {
                ...prev.channel,
                memberConnection: {
                  ...prev.channel.memberConnection,
                  pageInfo: {
                    ...prev.channel.memberConnection.pageInfo,
                    ...fetchMoreResult.channel.memberConnection.pageInfo,
                  },
                  edges: [
                    ...prev.channel.memberConnection.edges,
                    ...fetchMoreResult.channel.memberConnection.edges,
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
    },
    fetchPolicy: 'cache-and-network',
  }),
};

export const getChannelMembersQuery = graphql(
  gql`
		query getChannel($id: ID) {
      channel(id: $id) {
        id
        ...channelMetaData
        memberConnection {
          pageInfo {
            hasNextPage
            hasPreviousPage
          }
          edges {
            cursor
            node {
              ...userInfo
            }
          }
        }
      }
		}
    ${userInfoFragment}
    ${channelMetaDataFragment}
	`,
  getChannelMembersOptions
);
