// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import communityInfoFragment from '../../fragments/community/communityInfo';
import type { CommunityInfoType } from '../../fragments/community/communityInfo';

export type AddCommunityMemberWithTokenType = {
  data: {
    addCommunityMemberWithToken: {
      ...$Exact<CommunityInfoType>,
    },
  },
};

export const addCommunityMemberWithTokenMutation = gql`
  mutation addCommunityMemberWithToken(
    $input: AddCommunityMemberWithTokenInput!
  ) {
    addCommunityMemberWithToken(input: $input) {
      ...communityInfo
    }
  }
  ${communityInfoFragment}
`;

const addCommunityMemberWithTokenOptions = {
  options: {
    refetchQueries: ['getCurrentUserCommunityConnection'],
  },
  props: ({ mutate }) => ({
    addCommunityMemberWithToken: input =>
      mutate({
        variables: {
          input,
        },
      }),
  }),
};

export default graphql(
  addCommunityMemberWithTokenMutation,
  addCommunityMemberWithTokenOptions
);
