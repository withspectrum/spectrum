// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import communityMetaDataFragment from '../../fragments/community/communityMetaData';
import type { CommunityMetaDataType } from '../../fragments/community/communityMetaData';
import communityInfoFragment from '../../fragments/community/communityInfo';
import type { CommunityInfoType } from '../../fragments/community/communityInfo';
import communityChannelConnectionFragment from '../../fragments/community/communityChannelConnection';
import type { CommunityChannelConnectionType } from '../../fragments/community/communityChannelConnection';

export type AddCommunityMembersType = {
  data: {
    addCommunityMembers: Array<?{
      ...$Exact<CommunityInfoType>,
      ...$Exact<CommunityMetaDataType>,
      ...$Exact<CommunityChannelConnectionType>,
    }>,
  },
};

export type AddCommunityMembersProps = {
  addCommunityMembers: ({ input: { communityIds: Array<string> } }) => Promise<
    AddCommunityMembersType
  >,
};

export const addCommunityMembersMutation = gql`
  mutation addCommunityMembers($input: AddCommunityMembersInput!) {
    addCommunityMembers(input: $input) {
      ...communityInfo
      ...communityMetaData
      ...communityChannelConnection
    }
  }
  ${communityInfoFragment}
  ${communityMetaDataFragment}
  ${communityChannelConnectionFragment}
`;

const addCommunityMembersOptions = {
  props: ({ mutate }) => ({
    addCommunityMembers: ({ input }) =>
      mutate({
        variables: {
          input,
        },
      }),
  }),
};

export default graphql(addCommunityMembersMutation, addCommunityMembersOptions);
