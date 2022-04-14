import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { userInfoFragment } from './fragments/user/userInfo';
import { userCommunitiesFragment } from './fragments/user/userCommunities';

const SAVE_USER_COMMUNITY_PERMISSIONS_MUTATION = gql`
  mutation saveUserCommunityPermissions(
    $input: SaveUserCommunityPermissionsInput!
  ) {
    saveUserCommunityPermissions(input: $input) {
      ...userInfo
      ...userCommunities
    }
  }
  ${userInfoFragment}
  ${userCommunitiesFragment}
`;

const SAVE_USER_COMMUNITY_PERMISSIONS_OPTIONS = {
  props: ({ input, mutate }) => ({
    saveUserCommunityPermissions: input =>
      mutate({
        variables: {
          input,
        },
      }),
  }),
};

export const saveUserCommunityPermissionsMutation = graphql(
  SAVE_USER_COMMUNITY_PERMISSIONS_MUTATION,
  SAVE_USER_COMMUNITY_PERMISSIONS_OPTIONS
);
