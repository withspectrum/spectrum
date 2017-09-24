import React from 'react';
import {
  ProfileHeader,
  CommunityAvatar,
  ProfileHeaderLink,
  ProfileHeaderMeta,
  Title,
  Subtitle,
} from './style';

export const CommunityProfile = ({ community }) => {
  return (
    <ProfileHeader>
      <CommunityAvatar
        size={32}
        radius={4}
        community
        src={community.profilePhoto}
      />
      <ProfileHeaderLink to={`/communities/${community.slug}`}>
        <ProfileHeaderMeta>
          <Title>{community.name}</Title>
          {community.metaData && (
            <Subtitle>{community.metaData.members} members</Subtitle>
          )}
        </ProfileHeaderMeta>
      </ProfileHeaderLink>
    </ProfileHeader>
  );
};
