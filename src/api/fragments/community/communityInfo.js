import { gql } from 'react-apollo';

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
    pinnedThreadId
    # roles
    communityPermissions {
      isMember
      isBlocked
      isOwner
      isModerator
    }
    # counts
    metaData {
      members
      channels
    }
  }
`;
