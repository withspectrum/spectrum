// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import communityMetaDataFragment from '../../fragments/community/communityMetaData';
import type { CommunityMetaDataType } from '../../fragments/community/communityMetaData';
import communityInfoFragment from '../../fragments/community/communityInfo';
import type { CommunityInfoType } from '../../fragments/community/communityInfo';
import communityChannelConnectionFragment from '../../fragments/community/communityChannelConnection';
import type { CommunityChannelConnectionType } from '../../fragments/community/communityChannelConnection';

export type RemoveCommunityMemberType = {
  data: {
    removeCommunityMember: {
      ...$Exact<CommunityInfoType>,
      ...$Exact<CommunityMetaDataType>,
      ...$Exact<CommunityChannelConnectionType>,
    },
  },
};

export const removeCommunityMemberQuery = gql`
  mutation removeCommunityMember($input: RemoveCommunityMemberInput!) {
    removeCommunityMember(input: $input) {
      ...communityInfo
      ...communityMetaData
      ...communityChannelConnection
    }
  }
  ${communityInfoFragment}
  ${communityMetaDataFragment}
  ${communityChannelConnectionFragment}
`;

const removeCommunityMemberOptions = {
  props: ({ mutate }) => ({
    removeCommunityMember: ({ input }) =>
      mutate({
        variables: {
          input,
        },
      }),
  }),
};

export default graphql(
  removeCommunityMemberQuery,
  removeCommunityMemberOptions
);
