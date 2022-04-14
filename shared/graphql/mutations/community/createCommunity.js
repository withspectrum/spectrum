// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import communityInfoFragment from '../../fragments/community/communityInfo';
import { getCommunityBySlugQuery } from '../../queries/community/getCommunity';
import type { CommunityInfoType } from '../../fragments/community/communityInfo';

export type CreateCommunityType = {
  data: {
    createCommunity: {
      ...$Exact<CommunityInfoType>,
    },
  },
};

type CreateCommunityInput = {
  name: string,
  slug: string,
  description: string,
  website: string,
  file: Object,
  coverFile: Object,
};

export const createCommunityMutation = gql`
  mutation createCommunity($input: CreateCommunityInput!) {
    createCommunity(input: $input) {
      ...communityInfo
    }
  }
  ${communityInfoFragment}
`;

const createCommunityOptions = {
  props: ({ mutate }) => ({
    createCommunity: (input: CreateCommunityInput) =>
      mutate({
        variables: {
          input,
        },
      }),
  }),
  options: {
    refetchQueries: result => [
      {
        query: getCommunityBySlugQuery,
        variables: {
          slug: result.data.createCommunity.slug,
        },
      },
    ],
  },
};

export default graphql(createCommunityMutation, createCommunityOptions);
