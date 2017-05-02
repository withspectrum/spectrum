import { gql } from 'react-apollo';

export const userInfoFragment = gql`
  fragment userInfo on User {
    uid
    photoURL
    displayName
    username
  }
`;
