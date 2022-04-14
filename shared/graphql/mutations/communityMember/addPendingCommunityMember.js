// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import communityInfoFragment from '../../fragments/community/communityInfo';
import type { CommunityInfoType } from '../../fragments/community/communityInfo';

export type AddPendingCommunityMemberType = {
  data: {
    addPendingCommunityMember: {
      ...$Exact<CommunityInfoType>,
    },
  },
};

export const addPendingCommunityMemberQuery = gql`
  mutation addPendingCommunityMember($input: AddPendingCommunityMemberInput!) {
    addPendingCommunityMember(input: $input) {
      ...communityInfo
    }
  }
  ${communityInfoFragment}
`;

const addPendingCommunityMemberOptions = {
  props: ({ mutate }) => ({
    addPendingCommunityMember: ({ input }) =>
      mutate({
        variables: {
          input,
        },
      }),
  }),
};

export default graphql(
  addPendingCommunityMemberQuery,
  addPendingCommunityMemberOptions
);
