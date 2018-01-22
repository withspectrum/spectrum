// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import communityInfoFragment from 'shared/graphql/fragments/community/communityInfo';
import type { CommunityInfoType } from '../../fragments/community/communityInfo';

export type EditCommunityType = {
  ...$Exact<CommunityInfoType>,
};

type EditCommunityInput = {
  name: string,
  slug: string,
  description: string,
  website: string,
  file: Object,
  coverFile: Object,
  communityId: string,
};

const editCommunityMutation = gql`
  mutation editCommunity($input: EditCommunityInput!) {
    editCommunity(input: $input) {
      ...communityInfo
    }
  }
  ${communityInfoFragment}
`;

const editCommunityOptions = {
  props: ({ input, mutate }) => ({
    editCommunity: (input: EditCommunityInput) =>
      mutate({
        variables: {
          input,
        },
      }),
  }),
};

export default graphql(editCommunityMutation, editCommunityOptions);
