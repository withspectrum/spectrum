// @flow
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import communityInfoFragment, {
  type CommunityInfoType,
} from 'shared/graphql/fragments/community/communityInfo';
import communitySettingsFragment, {
  type CommunitySettingsType,
} from 'shared/graphql/fragments/community/communitySettings';
import communityMemberInfoFragment, {
  type CommunityMemberInfoType,
} from '../../fragments/communityMember/communityMemberInfo';

export type GetCommunityTopMembersType = {
  ...$Exact<CommunityInfoType>,
  ...$Exact<CommunitySettingsType>,
  topMembers: Array<?CommunityMemberInfoType>,
};

export const getCommunityTopMembersQuery = gql`
  query getCommunityTopMembers($id: ID) {
    community(id: $id) {
      ...communityInfo
      ...communitySettings
      topMembers {
        ...communityMemberInfo
      }
    }
  }
  ${communityInfoFragment}
  ${communitySettingsFragment}
  ${communityMemberInfoFragment}
`;

const getCommunityTopMembersOptions = {
  options: ({ id }: { id: string }) => ({
    variables: {
      id,
    },
    fetchPolicy: 'cache-and-network',
  }),
};

export default graphql(
  getCommunityTopMembersQuery,
  getCommunityTopMembersOptions
);
