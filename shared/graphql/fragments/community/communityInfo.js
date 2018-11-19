// @flow
import gql from 'graphql-tag';
import type { ThreadInfoType } from '../thread/threadInfo';

export type CommunityInfoType = {
  id: string,
  createdAt: Date,
  name: string,
  slug: string,
  description: ?string,
  website: ?string,
  profilePhoto: string,
  coverPhoto: string,
  pinnedThreadId: ?string,
  watercoolerId: ?string,
  isPrivate: boolean,
  communityPermissions: {
    isMember: boolean,
    isBlocked: boolean,
    isOwner: boolean,
    isPending: boolean,
    isModerator: boolean,
    reputation: number,
  },
  brandedLogin: {
    isEnabled: boolean,
    message: ?string,
  },
};

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
    watercoolerId
    isPrivate
    communityPermissions {
      isMember
      isBlocked
      isOwner
      isPending
      isModerator
      reputation
    }
    brandedLogin {
      isEnabled
      message
    }
  }
`;
