import { gql } from 'react-apollo';

export const channelInfoFragment = gql`
  fragment channelInfo on Channel {
    id
    name
    slug
    description
    isPrivate
    createdAt
    channelPermissions {
      isMember
      isPending
      isBlocked
      isOwner
      isModerator
      receiveNotifications
    }
  }
`;
