// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

export const toggleCommunityRedirectMutation = gql`
  mutation toggleCommunityRedirect($communityId: ID!) {
    toggleCommunityRedirect(communityId: $communityId) {
      id
      slug
      redirect
    }
  }
`;

const toggleCommunityRedirectOptions = {
  props: ({ mutate }) => ({
    toggleCommunityRedirect: communityId =>
      mutate({
        variables: {
          communityId,
        },
      }),
  }),
};

export default graphql(
  toggleCommunityRedirectMutation,
  toggleCommunityRedirectOptions
);
