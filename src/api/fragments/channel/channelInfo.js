import { gql } from 'react-apollo';
import { communityInfoFragment } from '../community/communityInfo';

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
    community {
      ...communityInfo
    }
  }
  ${communityInfoFragment}
`;
