// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import communityInfoFragment from '../../fragments/community/communityInfo';
import type { CommunityInfoType } from '../../fragments/community/communityInfo';

export type AddCommunityModeratorType = {
  data: {
    addCommunityModerator: {
      ...$Exact<CommunityInfoType>,
    },
  },
};

export const addCommunityModeratorQuery = gql`
  mutation addCommunityModerator($input: AddCommunityModeratorInput!) {
    addCommunityModerator(input: $input) {
      ...communityInfo
    }
  }
  ${communityInfoFragment}
`;

const addCommunityModeratorOptions = {
  props: ({ mutate }) => ({
    addCommunityModerator: ({ input }) =>
      mutate({
        variables: {
          input,
        },
      }),
  }),
};

export default graphql(
  addCommunityModeratorQuery,
  addCommunityModeratorOptions
);
