// @flow
// $FlowFixMe
import { graphql, gql } from 'react-apollo';
import { channelInfoFragment } from './fragments/channel/channelInfo';

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
  mutation deleteChannel($id: ID!) {
    deleteChannel (id: $id)
  }
`;

const DELETE_CHANNEL_OPTIONS = {
  props: ({ id, mutate }) => ({
    deleteChannel: id =>
      mutate({
        variables: {
          id,
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
  mutation toggleChannelSubscription($id: ID!) {
    toggleChannelSubscription (id: $id) {
      ...channelInfo
    }
  }
  ${channelInfoFragment}
`;

const TOGGLE_CHANNEL_SUBSCRIPTION_OPTIONS = {
  props: ({ id, mutate }) => ({
    toggleChannelSubscription: ({ id }) =>
      mutate({
        variables: {
          id,
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
    }
  }
  ${channelInfoFragment}
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
    }
  }
  ${channelInfoFragment}
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
  query getChannel($slug: String, $community: String) {
    channel(slug: $slug, community: $community) {
      ...channelInfo
    }
  }
  ${channelInfoFragment}
`;
