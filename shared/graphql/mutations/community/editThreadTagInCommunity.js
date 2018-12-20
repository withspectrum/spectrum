// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import communityInfoFragment from '../../fragments/community/communityInfo';
import type { CommunityInfoType } from '../../fragments/community/communityInfo';
import communityThreadTagsFragment from '../../fragments/community/communityThreadTags';
import type { CommunityThreadTagsType } from '../../fragments/community/communityThreadTags';

export type EditThreadTagInCommunityType = {
  data: {
    editThreadTagInCommunity: {
      ...$Exact<CommunityInfoType>,
      ...$Exact<CommunityThreadTagsType>,
    },
  },
};

export type EditThreadTagInCommunityInput = {
  communityId: string,
  tagId: string,
  title: string,
  hex: string,
};

export const editThreadTagInCommunityMutation = gql`
  mutation editThreadTagInCommunity($input: EditThreadTagInCommunityInput!) {
    editThreadTagInCommunity(input: $input) {
      ...communityInfo
      ...communityThreadTags
    }
  }
  ${communityInfoFragment}
  ${communityThreadTagsFragment}
`;

const editThreadTagInCommunityOptions = {
  props: ({ mutate }) => ({
    editThreadTagInCommunity: (input: EditThreadTagInCommunityInput) =>
      mutate({
        variables: {
          input,
        },
      }),
  }),
};

export default graphql(
  editThreadTagInCommunityMutation,
  editThreadTagInCommunityOptions
);
