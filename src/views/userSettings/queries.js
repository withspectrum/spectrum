// @flow
// $FlowFixMe
import { graphql, gql } from 'react-apollo';
import { userInfoFragment } from '../../api/fragments/user/userInfo';
import { userThreadsFragment } from '../../api/fragments/user/userThreads';
import {
  userCommunitiesFragment,
} from '../../api/fragments/user/userCommunities';

export const GetCurrentUserProfile = graphql(
  gql`
    query currentUserProfile {
			user: currentUser {
        ...userInfo
        ...userCommunities
      }
		}
    ${userInfoFragment}
    ${userCommunitiesFragment}
	`
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
