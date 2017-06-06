// @flow
// $FlowFixMe
import { graphql, gql } from 'react-apollo';
import { userInfoFragment } from './fragments/user/userInfo';
import {
  notificationInfoFragment,
} from './fragments/notification/notificationInfo';

/*
  Fetches the latest 20 notifications for the current user
*/
export const GET_CURRENT_USER_NOTIFICATIONS_QUERY = gql`
  query getCurrentUserNotifications {
    user: currentUser {
      ...userInfo
      notificationConnection {
        pageInfo {
          hasNextPage
          hasPreviousPage
        }
        edges {
          cursor
          node {
            ...notificationInfo
          }
        }
      }
    }
  }
  ${userInfoFragment}
  ${notificationInfoFragment}
`;
export const getCurrentUserNotifications = graphql(
  GET_CURRENT_USER_NOTIFICATIONS_QUERY
);
