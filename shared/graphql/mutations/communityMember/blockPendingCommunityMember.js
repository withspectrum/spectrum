// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import communityMemberInfoFragment, {
  type CommunityMemberInfoType,
} from '../../fragments/communityMember/communityMemberInfo';

export type BlockPendingCommunityMemberType = {
  data: {
    blockPendingCommunityMember: CommunityMemberInfoType,
  },
};

export const blockPendingCommunityMemberQuery = gql`
  mutation blockPendingCommunityMember(
    $input: BlockPendingCommunityMemberInput!
  ) {
    blockPendingCommunityMember(input: $input) {
      ...communityMemberInfo
    }
  }
  ${communityMemberInfoFragment}
`;

const blockPendingCommunityMemberOptions = {
  props: ({ mutate }) => ({
    blockPendingCommunityMember: ({ input }) =>
      mutate({
        variables: {
          input,
        },
      }),
  }),
};

export default graphql(
  blockPendingCommunityMemberQuery,
  blockPendingCommunityMemberOptions
);
