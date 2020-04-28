// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

export const toggleCommunityNoindexMutation = gql`
  mutation toggleCommunityNoindex($communityId: ID!) {
    toggleCommunityNoindex(communityId: $communityId) {
      id
      slug
      noindex
    }
  }
`;

const toggleCommunityNoindexOptions = {
  props: ({ mutate }) => ({
    toggleCommunityNoindex: communityId =>
      mutate({
        variables: {
          communityId,
        },
      }),
  }),
};

export default graphql(
  toggleCommunityNoindexMutation,
  toggleCommunityNoindexOptions
);
