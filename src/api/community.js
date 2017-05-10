// @flow
// $FlowFixMe
import { graphql, gql } from 'react-apollo';
import { communityInfoFragment } from './fragments/community/communityInfo';

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
      })
        .then(({ data }) => {
          return data.createCommunity;
        })
        .catch(error => {
          // TODO: Add dispatch for global errors
          console.log('error creating community', error);
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
      })
        .then(({ data }) => {
          console.log('mutation complete ', data);
        })
        .catch(error => {
          console.log('error deleting community', error);
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
      })
        .then(({ data }) => {
          return data.editCommunity;
        })
        .catch(error => {
          // TODO: Add dispatch for global errors
          console.log('error creating community', error);
        }),
  }),
};

export const editCommunityMutation = graphql(
  EDIT_COMMUNITY_MUTATION,
  EDIT_COMMUNITY_OPTIONS
);
