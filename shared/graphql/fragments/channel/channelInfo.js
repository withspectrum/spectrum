// @flow
import gql from 'graphql-tag';
import communityInfoFragment from '../community/communityInfo';
import type { CommunityInfoType } from '../community/communityInfo';

export type ChannelInfoType = {
  id: string,
  name: string,
  slug: string,
  description: ?string,
  isPrivate: boolean,
  createdAt: Date,
  channelPermissions: {
    isMember: boolean,
    isPending: boolean,
    isBlocked: boolean,
    isOwner: boolean,
    isModerator: boolean,
    receiveNotifications: boolean,
  },
  community: {
    ...$Exact<CommunityInfoType>,
  },
};

export default gql`
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
