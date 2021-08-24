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
  timezone: number,
  betaSupporter?: boolean,
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
    timezone
    betaSupporter
  }
`;
