// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import communityInfoFragment from '../../fragments/community/communityInfo';
import type { CommunityInfoType } from '../../fragments/community/communityInfo';

export type RemovePendingCommunityMemberType = {
  data: {
    removePendingCommunityMember: {
      ...$Exact<CommunityInfoType>,
    },
  },
};

export const removePendingCommunityMemberQuery = gql`
  mutation removePendingCommunityMember(
    $input: RemovePendingCommunityMemberInput!
  ) {
    removePendingCommunityMember(input: $input) {
      ...communityInfo
    }
  }
  ${communityInfoFragment}
`;

const removePendingCommunityMemberOptions = {
  props: ({ mutate }) => ({
    removePendingCommunityMember: ({ input }) =>
      mutate({
        variables: {
          input,
        },
      }),
  }),
};

export default graphql(
  removePendingCommunityMemberQuery,
  removePendingCommunityMemberOptions
);
