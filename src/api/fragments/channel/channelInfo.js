import gql from 'graphql-tag';

import { communityInfoFragment } from '../community/communityInfo.js';

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
