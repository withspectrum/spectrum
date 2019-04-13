// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import communityMetaDataFragment from '../../fragments/community/communityMetaData';
import type { CommunityMetaDataType } from '../../fragments/community/communityMetaData';
import communityInfoFragment from '../../fragments/community/communityInfo';
import type { CommunityInfoType } from '../../fragments/community/communityInfo';
import communityChannelConnectionFragment from '../../fragments/community/communityChannelConnection';
import type { CommunityChannelConnectionType } from '../../fragments/community/communityChannelConnection';

export type AddCommunityMemberType = {
  data: {
    addCommunityMember: {
      ...$Exact<CommunityInfoType>,
      ...$Exact<CommunityMetaDataType>,
      ...$Exact<CommunityChannelConnectionType>,
    },
  },
};

export type AddCommunityMemberProps = {
  addCommunityMember: ({
    input: { communityId: string },
  }) => Promise<AddCommunityMemberType>,
};

export const addCommunityMemberQuery = gql`
  mutation addCommunityMember($input: AddCommunityMemberInput!) {
    addCommunityMember(input: $input) {
      ...communityInfo
      ...communityMetaData
      ...communityChannelConnection
    }
  }
  ${communityInfoFragment}
  ${communityMetaDataFragment}
  ${communityChannelConnectionFragment}
`;

const addCommunityMemberOptions = {
  options: {
    refetchQueries: ['getCurrentUserCommunityConnection'],
  },
  props: ({ mutate }) => ({
    addCommunityMember: ({ input }) =>
      mutate({
        variables: {
          input,
        },
      }),
  }),
};

export default graphql(addCommunityMemberQuery, addCommunityMemberOptions);
