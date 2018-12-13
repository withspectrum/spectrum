// @flow
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import communityInfoFragment from '../../fragments/community/communityInfo';
import type { CommunityInfoType } from '../../fragments/community/communityInfo';
import communityMetaDataFragment from '../../fragments/community/communityMetaData';
import type { CommunityMetaDataType } from '../../fragments/community/communityMetaData';
import communityThreadTagsFragment from '../../fragments/community/communityThreadTags';
import type { CommunityThreadTagsType } from '../../fragments/community/communityThreadTags';

export type GetCommunityThreadTagsType = {
  ...$Exact<CommunityInfoType>,
  ...$Exact<CommunityMetaDataType>,
  ...$Exact<CommunityThreadTagsType>,
};

export const getCommunityThreadTagsQuery = gql`
  query getCommunityById($id: ID) {
    community(id: $id) {
      ...communityInfo
      ...communityMetaData
      ...communityThreadTags
    }
  }
  ${communityInfoFragment}
  ${communityMetaDataFragment}
  ${communityThreadTagsFragment}
`;

const getCommunityThreadTagsOptions = {
  options: ({ id }) => ({
    variables: {
      id,
    },
  }),
};

export const getCommunityThreadTags = graphql(
  getCommunityThreadTagsQuery,
  getCommunityThreadTagsOptions
);
