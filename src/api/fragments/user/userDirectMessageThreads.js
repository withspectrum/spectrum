// @flow
// $FlowFixme
import { gql } from 'react-apollo';
import { userInfoFragment } from '../user/userInfo';
import {
  directMessageThreadInfoFragment,
} from '../directMessageThread/directMessageThreadInfo';

export const userDirectMessageThreadsFragment = gql`
  fragment userDirectMessageThreads on User {
    directMessageThreadsConnection {
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      edges {
        node {
          ...directMessageThreadInfo
          participants {
            ...userInfo
          }
        }
      }
    }
  }
  ${userInfoFragment}
  ${directMessageThreadInfoFragment}
`;
