// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import communityMemberInfoFragment, {
  type CommunityMemberInfoType,
} from '../../fragments/communityMember/communityMemberInfo';

export type BlockCommunityMemberType = {
  data: {
    blockCommunityMember: CommunityMemberInfoType,
  },
};

export const blockCommunityMemberQuery = gql`
  mutation blockCommunityMember($input: BlockCommunityMemberInput!) {
    blockCommunityMember(input: $input) {
      ...communityMemberInfo
    }
  }
  ${communityMemberInfoFragment}
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
