import React from 'react';
import { Link } from 'react-router-dom';
import {
  MiniProfileHeader,
  ProfileHeader,
  CommunityAvatar,
  ProfileHeaderLink,
  MiniProfileHeaderMeta,
  ProfileHeaderMeta,
  MiniTitle,
  Title,
  MiniSubtitle,
  Subtitle,
  Description,
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
      <ProfileHeaderLink
        to={`https://spectrum.chat/${community.slug}`}
        target={'_blank'}
      >
        <ProfileHeaderMeta>
          <Title>{community.name}</Title>
          {community.metaData && (
            <Subtitle>
              {community.metaData.members === 1
                ? `${community.metaData.members} member`
                : `${community.metaData.members} members`}
            </Subtitle>
          )}
          <Description>{community.description}</Description>
        </ProfileHeaderMeta>
      </ProfileHeaderLink>
    </ProfileHeader>
  );
};

export const MiniUserProfile = ({ user }) => {
  return (
    <MiniProfileHeader>
      <CommunityAvatar size={16} radius={36} user src={user.profilePhoto} />
      <ProfileHeaderLink
        to={`https://spectrum.chat/users/${user.username}`}
        target={'_blank'}
      >
        <MiniProfileHeaderMeta>
          <MiniTitle>{user.name}</MiniTitle>

          <MiniSubtitle> · </MiniSubtitle>

          {user.email && (
            <a href={`mailto:${user.email}`}>
              <MiniSubtitle>Email</MiniSubtitle>
            </a>
          )}
        </MiniProfileHeaderMeta>
      </ProfileHeaderLink>
    </MiniProfileHeader>
  );
};
