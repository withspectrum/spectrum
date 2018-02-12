// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import communityMemberInfoFragment, {
  type CommunityMemberInfoType,
} from '../../fragments/communityMember/communityMemberInfo';

export type UnblockCommunityMemberType = {
  data: {
    unblockCommunityMember: CommunityMemberInfoType,
  },
};

export const unblockCommunityMemberQuery = gql`
  mutation unblockCommunityMember($input: UnblockCommunityMemberInput!) {
    unblockCommunityMember(input: $input) {
      ...communityMemberInfo
    }
  }
  ${communityMemberInfoFragment}
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
