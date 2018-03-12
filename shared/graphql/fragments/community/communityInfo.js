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
  isPro: boolean,
  communityPermissions: {
    isMember: boolean,
    isBlocked: boolean,
    isOwner: boolean,
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
    isPro
    communityPermissions {
      isMember
      isBlocked
      isOwner
      isModerator
      reputation
    }
    brandedLogin {
      isEnabled
      message
    }
  }
`;
