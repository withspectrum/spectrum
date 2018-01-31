// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import communityInfoFragment from '../../fragments/community/communityInfo';
import type { CommunityInfoType } from '../../fragments/community/communityInfo';

export type BlockCommunityMemberType = {
  data: {
    blockCommunityMember: {
      ...$Exact<CommunityInfoType>,
    },
  },
};

export const blockCommunityMemberQuery = gql`
  mutation blockCommunityMember($input: BlockCommunityMemberInput!) {
    blockCommunityMember(input: $input) {
      ...communityInfo
    }
  }
  ${communityInfoFragment}
`;

const blockCommunityMemberOptions = {
  props: ({ mutate }) => ({
    blockCommunityMember: ({ input }) =>
      mutate({
        variables: {
          input,
        },
      }),
  }),
};

export default graphql(blockCommunityMemberQuery, blockCommunityMemberOptions);
