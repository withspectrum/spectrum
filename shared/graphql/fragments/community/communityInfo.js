// @flow
import gql from 'graphql-tag';

export default gql`
  fragment communityInfo on Community {
    id
    createdAt
    name
    slug
    description
    website
    profilePhoto
    coverPhoto
    pinnedThreadId
    isPro
    communityPermissions {
      isMember
      isBlocked
      isOwner
      isModerator
      reputation
    }
  }
`;
