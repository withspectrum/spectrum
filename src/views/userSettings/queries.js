// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import userInfoFragment from 'shared/graphql/fragments/user/userInfo';
import userSettingsFragment from 'shared/graphql/fragments/user/userSettings';

export const GET_USER_PROFILE_QUERY = gql`
  query getUserSettings($username: String) {
    user(username: $username) {
      ...userInfo
      isPro
      email
      pendingEmail
      ...userSettings
    }
  }
  ${userInfoFragment}
  ${userSettingsFragment}
`;

export const GET_USER_PROFILE_OPTIONS = {
  options: ({ match }: { match: { params: { username: string } } }) => ({
    variables: {
      username: match.params.username,
    },
    fetchPolicy: 'network-only',
  }),
};

export const GetUserProfile = graphql(
  GET_USER_PROFILE_QUERY,
  GET_USER_PROFILE_OPTIONS
);
