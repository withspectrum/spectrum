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
    # roles
    isOwner
    isMember
    isModerator
    isBlocked
    # counts
    metaData {
      members
      channels
    }
  }
`;
