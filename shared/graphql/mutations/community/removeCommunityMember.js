// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import communityInfoFragment from '../../fragments/community/communityInfo';
import type { CommunityInfoType } from '../../fragments/community/communityInfo';

export type RemoveCommunityModeratorType = {
  data: {
    removeCommunityModerator: {
      ...$Exact<CommunityInfoType>,
    },
  },
};

export const removeCommunityModeratorQuery = gql`
  mutation removeCommunityModerator($input: RemoveCommunityModeratorInput!) {
    removeCommunityModerator(input: $input) {
      ...communityInfo
    }
  }
  ${communityInfoFragment}
`;

const removeCommunityModeratorOptions = {
  props: ({ mutate }) => ({
    removeCommunityModerator: ({ input }) =>
      mutate({
        variables: {
          input,
        },
      }),
  }),
};

export default graphql(
  removeCommunityModeratorQuery,
  removeCommunityModeratorOptions
);
