// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import communityInfoFragment from '../../fragments/community/communityInfo';
import type { CommunityInfoType } from '../../fragments/community/communityInfo';
import communityThreadTagsFragment from '../../fragments/community/communityThreadTags';
import type { CommunityThreadTagsType } from '../../fragments/community/communityThreadTags';

export type RemoveThreadTagsFromCommunityType = {
  data: {
    removeThreadTagsFromCommunity: {
      ...$Exact<CommunityInfoType>,
      ...$Exact<CommunityThreadTagsType>,
    },
  },
};

export type RemoveThreadTagsFromCommunityInput = {
  communityId: string,
  tagIds: Array<string>,
};

export const removeThreadTagsFromCommunityMutation = gql`
  mutation removeThreadTagsFromCommunity(
    $input: RemoveThreadTagsFromCommunityInput!
  ) {
    removeThreadTagsFromCommunity(input: $input) {
      ...communityInfo
      ...communityThreadTags
    }
  }
  ${communityInfoFragment}
  ${communityThreadTagsFragment}
`;

const removeThreadTagsFromCommunityOptions = {
  props: ({ mutate }) => ({
    removeThreadTagsFromCommunity: (
      input: RemoveThreadTagsFromCommunityInput
    ) =>
      mutate({
        variables: {
          input,
        },
      }),
  }),
};

export default graphql(
  removeThreadTagsFromCommunityMutation,
  removeThreadTagsFromCommunityOptions
);
