// @flow
// $FlowFixMe
import { graphql, gql } from 'react-apollo';
import { userInfoFragment } from '../../api/fragments/user/userInfo';
import { userStoriesFragment } from '../../api/fragments/user/userStories';

export const GetCurrentUserStories = gql`
  query currentUserStories($after: String) {
    currentUser {
      ...userInfo
      ...userStories
    }
  }
  ${userInfoFragment}
  ${userStoriesFragment}
`;
