// @flow
// $FlowFixMe
import { graphql, gql } from 'react-apollo';
import { userInfoFragment } from '../../api/fragments/user/userInfo';
import { userThreadsFragment } from '../../api/fragments/user/userThreads';

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
