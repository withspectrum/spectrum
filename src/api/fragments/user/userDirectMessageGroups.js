// @flow
// $FlowFixme
import { gql } from 'react-apollo';
import { userInfoFragment } from '../user/userInfo';
import {
  directMessageGroupInfoFragment,
} from '../directMessageGroup/directMessageGroupInfo';

export const userDirectMessageGroupsFragment = gql`
  fragment userDirectMessageGroups on User {
    directMessageGroupsConnection {
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      edges {
        node {
          ...directMessageGroupInfo
          users {
            ...userInfo
          }
        }
      }
    }
  }
  ${userInfoFragment}
  ${directMessageGroupInfoFragment}
`;
