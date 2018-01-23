import gql from 'graphql-tag';

export const communityInfoFragment = gql`
  fragment communityInfo on Community {
    # admin
    id
    createdAt
    # meta
    name
    slug
    description
    website
    profilePhoto
    coverPhoto
    # roles
    communityPermissions {
      isMember
      isBlocked
      isOwner
      isModerator
      receiveNotifications
    }
    # counts
    metaData {
      members
      channels
    }
  }
`;
