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
          console.log('mutation complete ', data);
        })
        .catch(error => {
          console.log('error creating community', error);
        }),
  }),
};

export const createCommunityMutation = graphql(
  CREATE_COMMUNITY_MUTATION,
  CREATE_COMMUNITY_OPTIONS
);
