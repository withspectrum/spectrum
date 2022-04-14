import gql from 'graphql-tag';

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
    isAdmin
    isPro
    isOnline
    totalReputation
  }
`;
