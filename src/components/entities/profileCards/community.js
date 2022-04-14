// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import { CommunityAvatar } from 'src/components/avatar';
import { CommunityActions } from './components/communityActions';
import { CommunityMeta } from './components/communityMeta';
import { ProfileContainer, CoverPhoto, ProfileAvatarContainer } from './style';
import type { CommunityInfoType } from 'shared/graphql/fragments/community/communityInfo';

type Props = {
  community: CommunityInfoType,
};

export const CommunityProfileCard = (props: Props) => {
  const { community } = props;

  return (
    <ProfileContainer data-cy="community-profile-card">
      <Link to={`/${community.slug}`}>
        <CoverPhoto src={community.coverPhoto} />
      </Link>

      <ProfileAvatarContainer>
        <CommunityAvatar
          showHoverProfile={false}
          size={60}
          community={community}
        />
      </ProfileAvatarContainer>

      <CommunityMeta community={community} />

      <CommunityActions community={community} />
    </ProfileContainer>
  );
};
