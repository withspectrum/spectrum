// @flow
// $FlowFixMe
import { graphql, gql } from 'react-apollo';
import { communityInfoFragment } from './fragments/community/communityInfo';
import { channelInfoFragment } from './fragments/channel/channelInfo';
import { userInfoFragment } from './fragments/user/userInfo';
import { channelMetaDataFragment } from './fragments/channel/channelMetaData';

/*
  Create a new community
*/
const CREATE_COMMUNITY_MUTATION = gql`
  mutation createCommunity($input: CreateCommunityInput!) {
    createCommunity (input: $input) {
      ...communityInfo
    }
  }
  ${communityInfoFragment}
`;

const CREATE_COMMUNITY_OPTIONS = {
  props: ({ input, mutate }) => ({
    createCommunity: input =>
      mutate({
        variables: {
          input,
        },
        // update: (proxy, { data: { createCommunity } }) => {
        //   // read the data from the cache for the queries this affects
        //   const data = proxy.readQuery({
        //     query: GET_CURRENT_USER_COMMUNITIES_QUERY,
        //   });
        //
        //   // insert the new community
        //   data.user.communityConnection.edges.push({
        //     node: {
        //       ...createCommunity,
        //     },
        //   });
        //
        //   // write the new data back to the cache
        //   proxy.writeQuery({ query: GET_CURRENT_USER_COMMUNITIES_QUERY, data });
        // },
      }),
  }),
};

export const createCommunityMutation = graphql(
  CREATE_COMMUNITY_MUTATION,
  CREATE_COMMUNITY_OPTIONS
);

/*
  Delete a community
*/
const DELETE_COMMUNITY_MUTATION = gql`
  mutation deleteCommunity($communityId: ID!) {
    deleteCommunity (communityId: $communityId)
  }
`;

const DELETE_COMMUNITY_OPTIONS = {
  props: ({ communityId, mutate }) => ({
    deleteCommunity: communityId =>
      mutate({
        variables: {
          communityId,
        },
      }),
  }),
};

export const deleteCommunityMutation = graphql(
  DELETE_COMMUNITY_MUTATION,
  DELETE_COMMUNITY_OPTIONS
);

/*
  Edit a new community
*/
const EDIT_COMMUNITY_MUTATION = gql`
  mutation editCommunity($input: EditCommunityInput!) {
    editCommunity (input: $input) {
      ...communityInfo
    }
  }
  ${communityInfoFragment}
`;

const EDIT_COMMUNITY_OPTIONS = {
  props: ({ input, mutate }) => ({
    editCommunity: input =>
      mutate({
        variables: {
          input,
        },
      }),
  }),
};

export const editCommunityMutation = graphql(
  EDIT_COMMUNITY_MUTATION,
  EDIT_COMMUNITY_OPTIONS
);

/*
  Join or leave a community
*/
const TOGGLE_COMMUNITY_MEMBERSHIP_MUTATION = gql`
  mutation toggleCommunityMembership($communityId: ID!) {
    toggleCommunityMembership (communityId: $communityId) {
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
  ${communityInfoFragment}
  ${channelInfoFragment}
  ${userInfoFragment}
  ${channelMetaDataFragment}
`;

const TOGGLE_COMMUNITY_MEMBERSHIP_OPTIONS = {
  props: ({ communityId, mutate }) => ({
    toggleCommunityMembership: ({ communityId }) =>
      mutate({
        variables: {
          communityId,
        },
      }),
  }),
};

export const toggleCommunityMembershipMutation = graphql(
  TOGGLE_COMMUNITY_MEMBERSHIP_MUTATION,
  TOGGLE_COMMUNITY_MEMBERSHIP_OPTIONS
);

/*
  Checks a slug against the db to make sure a community with that slug
  doesn't already exist
*/
export const CHECK_UNIQUE_COMMUNITY_SLUG_QUERY = gql`
  query community($slug: String) {
    community(slug: $slug) {
      ...communityInfo
    }
  }
  ${communityInfoFragment}
`;
