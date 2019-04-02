// @flow
import gql from 'graphql-tag';
import communityInfoFragment from '../community/communityInfo';
import communityMetaFragment from '../community/communityMetaData';
import type { CommunityInfoType } from '../community/communityInfo';
import type { CommunityMetaDataType } from '../community/communityMetaData';

export type ChannelInfoType = {
  id: string,
  name: string,
  slug: string,
  description: ?string,
  isPrivate: boolean,
  createdAt: Date,
  isArchived: boolean,
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
    ...$Exact<CommunityMetaDataType>,
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
    isArchived
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
      ...communityMetaData
    }
  }
  ${communityInfoFragment}
  ${communityMetaFragment}
`;
