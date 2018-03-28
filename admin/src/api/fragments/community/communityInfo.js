import gql from 'graphql-tag';

export const communityInfoFragment = gql`
  fragment communityInfo on Community {
    id
    createdAt
    name
    slug
    description
    website
    profilePhoto
    coverPhoto
    hasChargeableSource
    communityPermissions {
      isMember
      isBlocked
      isOwner
      isModerator
      receiveNotifications
    }
    metaData {
      members
      channels
    }
  }
`;
