// @flow
import gql from 'graphql-tag';

export default gql`
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
    timezone
  }
`;
