// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

export const toggleCommunityNofollowMutation = gql`
  mutation toggleCommunityNofollow($communityId: ID!) {
    toggleCommunityNofollow(communityId: $communityId) {
      id
      slug
      nofollow
    }
  }
`;

const toggleCommunityNofollowOptions = {
  props: ({ mutate }) => ({
    toggleCommunityNofollow: communityId =>
      mutate({
        variables: {
          communityId,
        },
      }),
  }),
};

export default graphql(
  toggleCommunityNofollowMutation,
  toggleCommunityNofollowOptions
);
