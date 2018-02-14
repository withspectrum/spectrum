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
  hasChargeableSource: boolean,
  communityPermissions: {
    isMember: boolean,
    isBlocked: boolean,
    isOwner: boolean,
    isModerator: boolean,
    reputation: number,
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
    hasChargeableSource
    communityPermissions {
      isMember
      isBlocked
      isOwner
      isModerator
      reputation
    }
  }
`;
