import { gql } from 'react-apollo';

export const userInfoFragment = gql`
  fragment userInfo on User {
    id
    profilePhoto
    coverPhoto
    name
    firstName
    description
    website
    username
    isOnline
  }
`;
