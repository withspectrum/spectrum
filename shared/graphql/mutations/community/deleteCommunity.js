// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

export type DeleteCommunityType = boolean;

export const deleteCommunityMutation = gql`
  mutation deleteCommunity($communityId: ID!) {
    deleteCommunity(communityId: $communityId)
  }
`;

const deleteCommunityOptions = {
  props: ({ communityId, mutate }) => ({
    deleteCommunity: (communityId: string) =>
      mutate({
        variables: {
          communityId,
        },
      }),
  }),
};

export default graphql(deleteCommunityMutation, deleteCommunityOptions);
