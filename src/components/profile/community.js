// @flow
import React from 'react';
import Card from '../card';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';
//$FlowFixMe
import renderComponent from 'recompose/renderComponent';
//$FlowFixMe
import branch from 'recompose/branch';
//$FlowFixMe
import { Link } from 'react-router-dom';
import { LoadingCard } from '../loading';
import {
  ProfileHeader,
  ProfileHeaderMeta,
  Title,
  Description,
  Actions,
  ActionOutline,
} from './style';
import { MetaData } from './metaData';
import type { ProfileSizeProps } from './index';

const displayLoadingState = branch(
  props => props.data.loading,
  renderComponent(LoadingCard)
);

type CommunityProps = {
  id: String,
  name: String,
  slug: String,
  metaData: {
    frequencies: Number,
    members: Number,
  },
};

const CommunityWithData = ({
  data: { community },
  profileSize,
  data,
}: {
  data: { community: CommunityProps },
  profileSize: ProfileSizeProps,
}): React$Element<any> => {
  const componentSize = profileSize || 'mini';
  console.log('community', community);
  if (!community) {
    return (
      <Card>
        <ProfileHeader justifyContent={'flex-start'} alignItems={'center'}>
          <ProfileHeaderMeta direction={'column'} justifyContent={'center'}>
            <Title>This community doesn't exist yet.</Title>
          </ProfileHeaderMeta>
        </ProfileHeader>
        <Description>Want to make it?</Description>
        <Actions>
          <ActionOutline>Create</ActionOutline>
        </Actions>
      </Card>
    );
  }

  return (
    <Card>
      <ProfileHeader justifyContent={'flex-start'} alignItems={'center'}>
        <ProfileHeaderMeta direction={'column'} justifyContent={'center'}>
          <Link to={`/${community.slug}`}>
            <Title>{community.name}</Title>
          </Link>
        </ProfileHeaderMeta>
      </ProfileHeader>

      {componentSize !== 'mini' &&
        componentSize !== 'small' &&
        <Description>
          {community.description}
        </Description>}

      {componentSize !== 'mini' &&
        <Actions>
          {community.isOwner &&
            <ActionOutline>
              <Link to={`/${community.slug}/settings`}>Settings</Link>
            </ActionOutline>}
          <ActionOutline>Join</ActionOutline>
        </Actions>}

      {(componentSize === 'large' || componentSize === 'full') &&
        <MetaData data={community.metaData} />}
    </Card>
  );
};

const Community = compose(displayLoadingState, pure)(CommunityWithData);
export default Community;
