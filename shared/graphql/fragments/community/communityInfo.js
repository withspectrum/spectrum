// @flow
import gql from 'graphql-tag';

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
  lastActive?: Date,
  isPrivate: boolean,
  redirect?: Boolean,
  communityPermissions: {
    isMember: boolean,
    isBlocked: boolean,
    isOwner: boolean,
    isPending: boolean,
    isModerator: boolean,
    reputation: number,
    lastSeen?: Date,
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
    isPrivate
    watercoolerId
    lastActive
    redirect
    noindex
    communityPermissions {
      isMember
      isBlocked
      isOwner
      isPending
      isModerator
      reputation
      lastSeen
    }
    brandedLogin {
      isEnabled
      message
    }
  }
`;
