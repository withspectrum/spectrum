// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import communityMemberInfoFragment, {
  type CommunityMemberInfoType,
} from '../../fragments/communityMember/communityMemberInfo';

export type ApprovePendingCommunityMemberType = {
  data: {
    approvePendingCommunityMember: CommunityMemberInfoType,
  },
};

export const approvePendingCommunityMemberQuery = gql`
  mutation approvePendingCommunityMember(
    $input: ApprovePendingCommunityMemberInput!
  ) {
    approvePendingCommunityMember(input: $input) {
      ...communityMemberInfo
    }
  }
  ${communityMemberInfoFragment}
`;

const approvePendingCommunityMemberOptions = {
  props: ({ mutate }) => ({
    approvePendingCommunityMember: ({ input }) =>
      mutate({
        variables: {
          input,
        },
      }),
  }),
};

export default graphql(
  approvePendingCommunityMemberQuery,
  approvePendingCommunityMemberOptions
);
