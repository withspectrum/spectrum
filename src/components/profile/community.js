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
//$FlowFixMe
import { connect } from 'react-redux';
import { toggleCommunityMembershipMutation } from '../../api/community';
import { addToastWithTimeout } from '../../actions/toasts';
import { LoadingCard } from '../loading';
import { Avatar } from '../avatar';
import {
  ProfileHeader,
  ProfileHeaderMeta,
  Title,
  Description,
  Actions,
  Action,
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
  isMember: Boolean,
  metaData: {
    frequencies: Number,
    members: Number,
  },
};

const CommunityWithData = ({
  data: { community },
  profileSize,
  toggleCommunityMembership,
  data,
  dispatch,
}: {
  data: { community: CommunityProps },
  profileSize: ProfileSizeProps,
}): React$Element<any> => {
  const componentSize = profileSize || 'mini';

  const toggleMembership = id => {
    toggleCommunityMembership({ id })
      .then(({ data }) => {
        const str = data.toggleCommunityMembership.isMember
          ? `Joined ${data.toggleCommunityMembership.name}!`
          : `Left ${data.toggleCommunityMembership.name}.`;

        const type = data.toggleCommunityMembership.isMember
          ? 'success'
          : 'neutral';
        dispatch(addToastWithTimeout(type, str));
      })
      .catch(err => {
        dispatch(
          addToastWithTimeout('error', `Oops, something went wrong. ${err}`)
        );
      });
  };

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
        <Avatar
          margin={'0 12px 0 0'}
          size={40}
          radius={4}
          src={community.photoURL}
        />
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
        componentSize !== 'small' &&
        community.website &&
        <Description>
          {community.website}
        </Description>}

      {componentSize !== 'mini' &&
        <Actions>

          {// user owns the community, assumed member
          community.isOwner &&
            <ActionOutline>
              <Link to={`/${community.slug}/settings`}>Settings</Link>
            </ActionOutline>}

          {// user is a member and doesn't own the community
          community.isMember &&
            !community.isOwner &&
            <ActionOutline
              color={'text.alt'}
              hoverColor={'warn.default'}
              onClick={() => toggleMembership(community.id)}
            >
              Leave Community
            </ActionOutline>}

          {// user is not a member and doesn't own the community
          !community.isMember &&
            !community.isOwner &&
            <Action onClick={() => toggleMembership(community.id)}>
              Join {community.name}
            </Action>}

        </Actions>}

      {(componentSize === 'large' || componentSize === 'full') &&
        <MetaData data={community.metaData} />}
    </Card>
  );
};

const Community = compose(
  toggleCommunityMembershipMutation,
  displayLoadingState,
  pure
)(CommunityWithData);
export default connect()(Community);
