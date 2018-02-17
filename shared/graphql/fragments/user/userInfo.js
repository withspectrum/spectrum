// @flow
import gql from 'graphql-tag';

export type UserInfoType = {
  id: string,
  profilePhoto: string,
  coverPhoto: string,
  name: string,
  firstName: ?string,
  description: ?string,
  website: ?string,
  username: string,
  isOnline: boolean,
  timezone: number,
  isPro: boolean,
  totalReputation: number,
};

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
    isPro
    totalReputation
  }
`;
