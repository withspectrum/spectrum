import { gql } from 'react-apollo';
import { userInfoFragment } from '../user/userInfo';

export const frequencySubscribersFragment = gql`
  fragment frequencySubscribers on Frequency {
    subscriberConnection {
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      edges {
        node {
          ...userInfo
        }
      }
    }
  }
  ${userInfoFragment}
`;
