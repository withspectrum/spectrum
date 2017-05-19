import { gql } from 'react-apollo';

export const userInfoFragment = gql`
  fragment userInfo on User {
    id
    profilePhoto
    name
    username
    isAdmin
  }
`;
