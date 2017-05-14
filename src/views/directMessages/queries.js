// @flow
// $FlowFixMe
import { graphql, gql } from 'react-apollo';
import {
  userDirectMessageGroupsFragment,
} from '../../api/fragments/user/userDirectMessageGroups';

export const GET_CURRENT_USER_DIRECT_MESSAGE_GROUPS_QUERY = gql`
  query currentUserDirectMessageGroups {
    user: currentUser {
      ...userDirectMessageGroups
    }
  }
  ${userDirectMessageGroupsFragment}
`;

export const GET_CURRENT_USER_DIRECT_MESSAGE_GROUPS_OPTIONS = {
  props: ({ data: { error, loading, user } }) => ({
    data: {
      error,
      loading,
      directMessages: user ? user.directMessageGroupsConnection.edges : '',
    },
  }),
};

export const getCurrentUserDirectMessageGroups = graphql(
  GET_CURRENT_USER_DIRECT_MESSAGE_GROUPS_QUERY,
  GET_CURRENT_USER_DIRECT_MESSAGE_GROUPS_OPTIONS
);
