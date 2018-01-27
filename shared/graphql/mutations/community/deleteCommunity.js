// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

export type DeleteCommunityType = {
  data: {
    deleteCommunity: boolean,
  },
};

export const deleteCommunityMutation = gql`
  mutation deleteCommunity($communityId: ID!) {
    deleteCommunity(communityId: $communityId)
  }
`;

const deleteCommunityOptions = {
  props: ({ mutate }) => ({
    deleteCommunity: (communityId: string) =>
      mutate({
        variables: {
          communityId,
        },
      }),
  }),
};

export default graphql(deleteCommunityMutation, deleteCommunityOptions);
