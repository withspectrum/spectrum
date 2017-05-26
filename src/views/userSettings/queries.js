// @flow
// $FlowFixMe
import { graphql, gql } from 'react-apollo';
import { userInfoFragment } from '../../api/fragments/user/userInfo';
import { userThreadsFragment } from '../../api/fragments/user/userThreads';
import {
  userCommunitiesFragment,
} from '../../api/fragments/user/userCommunities';

export const GET_USER_PROFILE_QUERY = gql`
  query getUserSettings($username: String) {
    user(username: $username) {
      ...userInfo
    }
  }
  ${userInfoFragment}
`;

export const GET_USER_PROFILE_OPTIONS = {
  options: ({ match }) => ({
    variables: {
      username: match.params.username,
    },
  }),
};

export const GetUserProfile = graphql(
  GET_USER_PROFILE_QUERY,
  GET_USER_PROFILE_OPTIONS
);

export const GetCurrentUserThreads = gql`
  query currentUserThreads($after: String) {
    currentUser {
      ...userInfo
      ...userThreads
    }
  }
  ${userInfoFragment}
  ${userThreadsFragment}
`;
