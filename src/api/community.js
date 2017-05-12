// @flow
// $FlowFixMe
import { graphql, gql } from 'react-apollo';
import { communityInfoFragment } from './fragments/community/communityInfo';
import { GET_CURRENT_USER_COMMUNITIES_QUERY } from '../views/dashboard/queries';

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
        update: (proxy, { data: { createCommunity } }) => {
          // read the data from the cache for the queries this affects
          const data = proxy.readQuery({
            query: GET_CURRENT_USER_COMMUNITIES_QUERY,
          });

          // insert the new community
          data.user.communityConnection.edges.push({
            node: {
              ...createCommunity,
            },
          });

          // write the new data back to the cache
          proxy.writeQuery({ query: GET_CURRENT_USER_COMMUNITIES_QUERY, data });
        },
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
  mutation deleteCommunity($id: ID!) {
    deleteCommunity (id: $id)
  }
`;

const DELETE_COMMUNITY_OPTIONS = {
  props: ({ id, mutate }) => ({
    deleteCommunity: id =>
      mutate({
        variables: {
          id,
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
  mutation toggleCommunityMembership($id: ID!) {
    toggleCommunityMembership (id: $id) {
      ...communityInfo
    }
  }
  ${communityInfoFragment}
`;

const TOGGLE_COMMUNITY_MEMBERSHIP_OPTIONS = {
  props: ({ id, mutate }) => ({
    toggleCommunityMembership: ({ id }) =>
      mutate({
        variables: {
          id,
        },
      }),
  }),
};

export const toggleCommunityMembershipMutation = graphql(
  TOGGLE_COMMUNITY_MEMBERSHIP_MUTATION,
  TOGGLE_COMMUNITY_MEMBERSHIP_OPTIONS
);
