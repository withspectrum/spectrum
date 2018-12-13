// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import communityInfoFragment from '../../fragments/community/communityInfo';
import type { CommunityInfoType } from '../../fragments/community/communityInfo';
import communityThreadTagsFragment from '../../fragments/community/communityThreadTags';
import type { CommunityThreadTagsType } from '../../fragments/community/communityThreadTags';

export type AddThreadTagsToCommunityType = {
  data: {
    addThreadTagsToCommunity: {
      ...$Exact<CommunityInfoType>,
      ...$Exact<CommunityThreadTagsType>,
    },
  },
};

export type AddThreadTagsToCommunityInput = {
  communityId: string,
  tags: Array<{ title: string }>,
};

export const addThreadTagsToCommunityMutation = gql`
  mutation addThreadTagsToCommunity($input: AddThreadTagsToCommunityInput!) {
    addThreadTagsToCommunity(input: $input) {
      ...communityInfo
      ...communityThreadTags
    }
  }
  ${communityInfoFragment}
  ${communityThreadTagsFragment}
`;

const addThreadTagsToCommunityOptions = {
  props: ({ mutate }) => ({
    addThreadTagsToCommunity: (input: AddThreadTagsToCommunityInput) =>
      mutate({
        variables: {
          input,
        },
      }),
  }),
};

export default graphql(
  addThreadTagsToCommunityMutation,
  addThreadTagsToCommunityOptions
);
