// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import communityInfoFragment from '../../fragments/community/communityInfo';
import type { CommunityInfoType } from '../../fragments/community/communityInfo';

export type UnblockCommunityMemberType = {
  data: {
    unblockCommunityMember: {
      ...$Exact<CommunityInfoType>,
    },
  },
};

export const unblockCommunityMemberQuery = gql`
  mutation unblockCommunityMember($input: UnblockCommunityMemberInput!) {
    unblockCommunityMember(input: $input) {
      ...communityInfo
    }
  }
  ${communityInfoFragment}
`;

const unblockCommunityMemberOptions = {
  props: ({ mutate }) => ({
    unblockCommunityMember: ({ input }) =>
      mutate({
        variables: {
          input,
        },
      }),
  }),
};

export default graphql(
  unblockCommunityMemberQuery,
  unblockCommunityMemberOptions
);
